import { describe, expect, it } from "vitest";
import { formatMoney, lateFeeCents } from "./fees";

describe("fees", () => {
  it("charges nothing before the due time", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-14T09:00:00.000Z")).toBe(0);
  });

  it("charges 50c per day late", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-18T09:00:00.000Z")).toBe(150);
  });

  it("only counts full days late", () => {
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-16T08:59:00.000Z")).toBe(0);
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-16T09:00:00.000Z")).toBe(50);
    expect(lateFeeCents("2026-11-15T09:00:00.000Z", "2026-11-27T00:00:00.000Z")).toBe(550);
  });

  it("caps the fee at $10", () => {
    expect(lateFeeCents("2026-01-01T00:00:00.000Z", "2026-11-27T00:00:00.000Z")).toBe(1000);
  });

  it("formats cents as dollars", () => {
    expect(formatMoney(550)).toBe("$5.50");
  });
});
