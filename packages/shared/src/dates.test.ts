import { describe, expect, it } from "vitest";
import { addDays, daysBetween, formatDate } from "./dates";

describe("dates", () => {
  it("formats in UTC", () => {
    expect(formatDate("2026-11-27T23:30:00.000Z")).toBe("27 Nov 2026");
  });

  it("adds days", () => {
    expect(addDays("2026-11-27T00:00:00.000Z", 14)).toBe("2026-12-11T00:00:00.000Z");
  });

  it("counts whole days", () => {
    expect(daysBetween("2026-11-27T00:00:00.000Z", "2026-11-29T12:00:00.000Z")).toBe(2);
    expect(daysBetween("2026-11-29T00:00:00.000Z", "2026-11-27T00:00:00.000Z")).toBe(-2);
  });
});
