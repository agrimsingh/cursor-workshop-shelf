import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

describe("notifications", () => {
  it("is empty when signed out", async () => {
    const api = testApi();
    const { data } = await api.query(`{ myNotifications { id } }`);
    expect(data?.myNotifications).toEqual([]);
  });

  it("errors with NOT_FOUND for an unknown notification", async () => {
    const api = testApi();
    const { errors } = await api.query(`mutation { markNotificationRead(id: "999") { id } }`, {}, "ada");
    expect(errors?.[0]?.extensions?.code).toBe("NOT_FOUND");
  });
});
