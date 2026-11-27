import { describe, expect, it, vi } from "vitest";
import { hookResponse } from "../.cursor/hooks/check-file-length.mjs";

const failing = () => ({ status: 1, stdout: "apps/x.ts  501 lines\n", stderr: "" });

describe("check-file-length stop hook", () => {
  it("sends a follow-up when a completed run leaves a file over the limit", () => {
    expect(hookResponse(JSON.stringify({ status: "completed" }), failing).followup_message).toContain("apps/x.ts  501 lines");
  });

  it("returns no follow-up when the check passes", () => {
    expect(hookResponse(JSON.stringify({ status: "completed" }), () => ({ status: 0, stdout: "", stderr: "" }))).toEqual({});
  });

  it.each(["aborted", "error"])("skips the check when the run was %s", (status) => {
    const check = vi.fn(failing);
    expect(hookResponse(JSON.stringify({ status }), check)).toEqual({});
    expect(check).not.toHaveBeenCalled();
  });

  it.each(["", "not json", "null", "{}"])("skips the check for empty or invalid input %j", (stdin) => {
    const check = vi.fn(failing);
    expect(hookResponse(stdin, check)).toEqual({});
    expect(check).not.toHaveBeenCalled();
  });
});
