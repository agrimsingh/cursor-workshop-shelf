#!/usr/bin/env node
// Runs the file length check when the agent stops, and sends any problems back as a follow-up.
import { spawnSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const runCheck = () => spawnSync("node", ["scripts/check-file-length.mjs"], { encoding: "utf8" });

// Only a completed run gets a follow-up, so aborting or erroring never restarts the agent.
export function hookResponse(stdin, check = runCheck) {
  let status;
  try {
    status = JSON.parse(stdin)?.status;
  } catch {
    return {};
  }
  if (status !== "completed") return {};

  const result = check();
  if (result.status === 0) return {};
  return {
    followup_message: `npm run check:length failed. Split these files into smaller modules, then run it again:\n\n${result.stdout}${result.stderr}`,
  };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  let stdin = "";
  try {
    stdin = readFileSync(0, "utf8");
  } catch {}
  console.log(JSON.stringify(hookResponse(stdin)));
}
