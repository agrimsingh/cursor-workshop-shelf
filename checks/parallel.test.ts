import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { testApi } from "../apps/api/src/testing";
import { BookCard } from "../apps/web/src/components/BookCard";
import { WaitlistButton } from "../apps/web/src/components/WaitlistButton";
import type { BookView } from "../apps/web/src/types";

const JOIN = `mutation ($id: ID!) { joinWaitlist(bookId: $id) { position user { id } } }`;
const LEAVE = `mutation ($id: ID!) { leaveWaitlist(bookId: $id) }`;
const RETURN = `mutation ($id: ID!) { returnBook(bookId: $id) { id } }`;
const WAITLIST = `{ book(id: "2") { waitlist { position user { id name } } myWaitlistPosition } }`;
const NOTIFICATIONS = `{ myNotifications { id message read book { id title } } }`;

// Book 2 (Designing Data-Intensive Applications) is on loan to grace. Book 1 is available.

describe("Part A: waitlist data and API", () => {
  it("queues people in the order they join", async () => {
    const api = testApi();
    expect((await api.query(JOIN, { id: "2" }, "ada")).data?.joinWaitlist).toEqual({ position: 1, user: { id: "ada" } });
    expect((await api.query(JOIN, { id: "2" }, "linus")).data?.joinWaitlist).toEqual({ position: 2, user: { id: "linus" } });

    const { data } = await api.query(WAITLIST, {}, "linus");
    expect(data?.book.waitlist).toEqual([
      { position: 1, user: { id: "ada", name: "Ada Lovelace" } },
      { position: 2, user: { id: "linus", name: "Linus Torvalds" } },
    ]);
    expect(data?.book.myWaitlistPosition).toBe(2);
    expect((await api.query(WAITLIST, {}, "margaret")).data?.book.myWaitlistPosition).toBeNull();
  });

  it("refuses joins that make no sense", async () => {
    const api = testApi();
    await api.query(JOIN, { id: "2" }, "ada");
    const code = async (id: string, user?: string) => (await api.query(JOIN, { id }, user)).errors?.[0]?.extensions?.code;

    expect(await code("2", "ada")).toBe("CONFLICT"); // already waiting
    expect(await code("1", "ada")).toBe("CONFLICT"); // available: borrow it instead
    expect(await code("2", "grace")).toBe("CONFLICT"); // grace has it
    expect(await code("999", "ada")).toBe("NOT_FOUND");
    expect(await code("2")).toBe("UNAUTHENTICATED");
  });

  it("moves everyone up when someone leaves", async () => {
    const api = testApi();
    await api.query(JOIN, { id: "2" }, "ada");
    await api.query(JOIN, { id: "2" }, "linus");

    expect((await api.query(LEAVE, { id: "2" }, "ada")).data?.leaveWaitlist).toBe(true);
    expect((await api.query(LEAVE, { id: "2" }, "ada")).data?.leaveWaitlist).toBe(false);
    expect((await api.query(WAITLIST, {}, "linus")).data?.book.myWaitlistPosition).toBe(1);
  });
});

const onLoanToLinus: BookView = {
  id: "5",
  title: "The Mythical Man-Month",
  author: "Frederick P. Brooks Jr.",
  year: 1975,
  coverColor: "#7a6a12",
  available: false,
  currentLoan: {
    id: "2",
    borrower: { id: "linus", name: "Linus Torvalds" },
    borrowedAt: "2026-11-01T09:00:00.000Z",
    dueAt: "2026-11-15T09:00:00.000Z",
    returnedAt: null,
    overdue: true,
  },
  waitlist: [
    { position: 1, user: { id: "grace", name: "Grace Hopper" }, joinedAt: "2026-11-20T00:00:00.000Z" },
    { position: 2, user: { id: "ada", name: "Ada Lovelace" }, joinedAt: "2026-11-21T00:00:00.000Z" },
  ],
  myWaitlistPosition: null,
};

const noop = () => {};
const render = (component: unknown, props: Record<string, unknown>) =>
  renderToStaticMarkup(createElement(component as never, props as never));

describe("Part B: waitlist UI", () => {
  it("invites you to join and shows how many are waiting", () => {
    const html = render(WaitlistButton, { book: onLoanToLinus, meId: "margaret", onJoin: noop, onLeave: noop });
    expect(html).toContain("Join waitlist");
    expect(html).toContain("2 waiting");
  });

  it("shows your place in line and lets you leave", () => {
    const book = { ...onLoanToLinus, myWaitlistPosition: 2 };
    const html = render(WaitlistButton, { book, meId: "ada", onJoin: noop, onLeave: noop });
    expect(html).toContain("#2");
    expect(html).toContain("Leave");
    expect(html).not.toContain("Join waitlist");
  });

  it("appears on the book card for books on loan to someone else", () => {
    const props = { book: onLoanToLinus, meId: "margaret", onBorrow: noop, onReturn: noop, onJoin: noop, onLeave: noop };
    expect(render(BookCard, props)).toContain("Join waitlist");
    expect(render(BookCard, { ...props, meId: "linus" })).not.toContain("Join waitlist");
  });
});

describe("Part C: notifications", () => {
  it("notifies the next person in line when a book comes back", async () => {
    const api = testApi();
    await api.query(JOIN, { id: "2" }, "ada");
    await api.query(JOIN, { id: "2" }, "linus");
    await api.query(RETURN, { id: "2" }, "grace");

    const ada = await api.query(NOTIFICATIONS, {}, "ada");
    expect(ada.errors).toBeUndefined();
    expect(ada.data?.myNotifications).toHaveLength(1);
    expect(ada.data?.myNotifications[0]).toMatchObject({
      read: false,
      book: { id: "2", title: "Designing Data-Intensive Applications" },
    });
    expect(ada.data?.myNotifications[0].message).toContain("Designing Data-Intensive Applications");

    expect((await api.query(NOTIFICATIONS, {}, "linus")).data?.myNotifications).toEqual([]);
    expect((await api.query(WAITLIST, {}, "linus")).data?.book.myWaitlistPosition).toBe(1);
  });

  it("lets only the owner mark a notification read", async () => {
    const api = testApi();
    await api.query(JOIN, { id: "2" }, "ada");
    await api.query(RETURN, { id: "2" }, "grace");
    const id = (await api.query(NOTIFICATIONS, {}, "ada")).data?.myNotifications[0].id;
    const MARK = `mutation ($id: ID!) { markNotificationRead(id: $id) { read } }`;

    expect((await api.query(MARK, { id }, "linus")).errors?.[0]?.extensions?.code).toBe("FORBIDDEN");
    expect((await api.query(MARK, { id }, "ada")).data?.markNotificationRead.read).toBe(true);
  });

  it("returns a book with nobody waiting without notifying anyone", async () => {
    const api = testApi();
    const returned = await api.query(RETURN, { id: "2" }, "grace");
    expect(returned.errors).toBeUndefined();
    expect((await api.query(NOTIFICATIONS, {}, "grace")).data?.myNotifications).toEqual([]);
    expect((await api.query(NOTIFICATIONS)).data?.myNotifications).toEqual([]);
  });
});
