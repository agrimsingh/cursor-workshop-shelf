import { describe, expect, it } from "vitest";
import { lateFeeCents } from "../packages/shared/src/fees";

describe("Context: late fee bug", () => {
  it("charges Linus for 11 full days on the morning of the workshop", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-27T00:00:00.000Z")).toBe(550);
  });

  it("charges nothing until a full day has passed", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-16T08:59:00.000Z")).toBe(0);
  });

  it("still charges exactly one day at the 24-hour mark", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-16T09:00:00.000Z")).toBe(50);
  });
});
