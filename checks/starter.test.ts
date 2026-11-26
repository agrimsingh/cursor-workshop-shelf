import { renderToStaticMarkup } from "react-dom/server";
import { createElement } from "react";
import { describe, expect, it } from "vitest";
import { testApi } from "../apps/api/src/testing";
import { BookCard } from "../apps/web/src/components/BookCard";

describe("Starter: book condition", () => {
  it("exposes condition on every book as NEW, GOOD, or WORN", async () => {
    const { data, errors } = await testApi().query(`{ books { condition } }`);
    expect(errors).toBeUndefined();
    const conditions = new Set(data?.books.map((b: { condition: string }) => b.condition));
    expect([...conditions].sort()).toEqual(["GOOD", "NEW", "WORN"]);
  });

  it("filters books by condition", async () => {
    const { data, errors } = await testApi().query(`{ books(condition: WORN) { condition } }`);
    expect(errors).toBeUndefined();
    expect(data?.books.length).toBeGreaterThan(0);
    expect(data?.books.every((b: { condition: string }) => b.condition === "WORN")).toBe(true);
  });

  it("combines the condition filter with search", async () => {
    const api = testApi();
    const all = await api.query(`{ books(search: "the") { condition } }`);
    const worn = await api.query(`{ books(search: "the", condition: WORN) { condition } }`);
    const expected = all.data?.books.filter((b: { condition: string }) => b.condition === "WORN").length;
    expect(worn.data?.books).toHaveLength(expected);
  });

  it("shows the condition on the book card", () => {
    const book = {
      id: "1",
      title: "Refactoring",
      author: "Martin Fowler",
      year: 2018,
      coverColor: "#6b2d5c",
      available: true,
      currentLoan: null,
      condition: "WORN",
    };
    const html = renderToStaticMarkup(
      createElement(BookCard, { book, meId: null, onBorrow: () => {}, onReturn: () => {} } as never),
    );
    expect(html).toContain("Worn");
  });
});
