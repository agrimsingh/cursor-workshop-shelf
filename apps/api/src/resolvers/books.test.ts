import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

describe("books", () => {
  it("lists every seeded book with availability", async () => {
    const api = testApi();
    const { data } = await api.query(`{ books { title available } }`);
    expect(data?.books).toHaveLength(12);
    expect(data?.books.filter((b: { available: boolean }) => !b.available)).toHaveLength(4);
  });

  it("searches by title or author", async () => {
    const api = testApi();
    const { data } = await api.query(`{ books(search: "fowler") { title } }`);
    expect(data?.books).toEqual([{ title: "Refactoring" }]);
  });
});
