import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

const JOIN = `mutation ($id: ID!) { joinWaitlist(bookId: $id) { position } }`;

describe("waitlist", () => {
  it("orders people who join at the same moment by who joined first", async () => {
    const api = testApi();
    await api.query(JOIN, { id: "2" }, "margaret");
    await api.query(JOIN, { id: "2" }, "ada");
    const { data } = await api.query(`{ book(id: "2") { waitlist { position user { id } } } }`);
    expect(data?.book.waitlist).toEqual([
      { position: 1, user: { id: "margaret" } },
      { position: 2, user: { id: "ada" } },
    ]);
  });

  it("requires a signed-in user to leave", async () => {
    const api = testApi();
    const { errors } = await api.query(`mutation { leaveWaitlist(bookId: "2") }`);
    expect(errors?.[0]?.extensions?.code).toBe("UNAUTHENTICATED");
  });
});
