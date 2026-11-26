import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import type { BookView } from "../types";
import { BookCard } from "./BookCard";

const book: BookView = {
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
};

const noop = () => {};

describe("BookCard", () => {
  it("shows who has an overdue book and when it was due", () => {
    const html = renderToStaticMarkup(<BookCard book={book} meId="ada" onBorrow={noop} onReturn={noop} />);
    expect(html).toContain("Overdue · Linus Torvalds · due 15 Nov 2026");
    expect(html).not.toContain("Return");
  });

  it("offers Return to the borrower", () => {
    const html = renderToStaticMarkup(<BookCard book={book} meId="linus" onBorrow={noop} onReturn={noop} />);
    expect(html).toContain("Return");
  });
});
