import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { testApi } from "../apps/api/src/testing";

const MY_LOANS = `{ myLoans { book { id } dueAt returnedAt renewals } }`;
const RENEW = `mutation ($id: ID!) { renewLoan(bookId: $id) { dueAt renewals } }`;

// Seed: grace has book 2 (due 4 Dec), linus has book 5 (overdue), ada has book 7 (due 8 Dec).

describe("Builder: my loans", () => {
  it("lists the signed-in user's loans, newest first", async () => {
    const api = testApi();
    await api.query(`mutation { borrowBook(bookId: "1") { id } }`, {}, "ada");
    const { data, errors } = await api.query(MY_LOANS, {}, "ada");
    expect(errors).toBeUndefined();
    expect(data?.myLoans.map((l: { book: { id: string } }) => l.book.id)).toEqual(["1", "7"]);
    expect(data?.myLoans[0].renewals).toBe(0);
  });

  it("is empty when signed out", async () => {
    const { data } = await testApi().query(MY_LOANS);
    expect(data?.myLoans).toEqual([]);
  });

  it("renews a loan once for another 14 days", async () => {
    const api = testApi();
    const first = await api.query(RENEW, { id: "2" }, "grace");
    expect(first.data?.renewLoan).toEqual({ dueAt: "2026-12-18T09:00:00.000Z", renewals: 1 });

    const second = await api.query(RENEW, { id: "2" }, "grace");
    expect(second.errors?.[0]?.extensions?.code).toBe("CONFLICT");
  });

  it("refuses renewals that break the rules", async () => {
    const api = testApi();
    const code = async (id: string, user?: string) => (await api.query(RENEW, { id }, user)).errors?.[0]?.extensions?.code;
    expect(await code("5", "linus")).toBe("CONFLICT"); // overdue
    expect(await code("2", "ada")).toBe("FORBIDDEN"); // grace's book
    expect(await code("1", "ada")).toBe("CONFLICT"); // not on loan
    expect(await code("2")).toBe("UNAUTHENTICATED");
  });

  it("shows due dates and a Renew button on the My loans page", async () => {
    const modulePath = "../apps/web/src/components/MyLoans";
    const { MyLoans } = await import(/* @vite-ignore */ modulePath);
    const loan = (id: string, overrides: Record<string, unknown>) => ({
      id,
      book: { id, title: `Book ${id}` },
      borrowedAt: "2026-11-20T09:00:00.000Z",
      dueAt: "2026-12-04T09:00:00.000Z",
      returnedAt: null,
      overdue: false,
      renewals: 0,
      lateFeeCents: 0,
      ...overrides,
    });

    const renewable = renderToStaticMarkup(createElement(MyLoans as never, { loans: [loan("1", {})], onRenew: () => {} } as never));
    expect(renewable).toContain("Book 1");
    expect(renewable).toContain("4 Dec 2026");
    expect(renewable).toContain("Renew");

    const overdue = renderToStaticMarkup(
      createElement(MyLoans as never, { loans: [loan("2", { overdue: true })], onRenew: () => {} } as never),
    );
    expect(overdue).not.toContain("Renew");
  });
});
