#!/usr/bin/env node
// Runs the file length check when the agent stops, and sends any problems back as a follow-up.
import { spawnSync } from "node:child_process";

const result = spawnSync("node", ["scripts/check-file-length.mjs"], { encoding: "utf8" });

if (result.status === 0) {
  console.log("{}");
} else {
  console.log(
    JSON.stringify({
      followup_message: `npm run check:length failed. Split these files into smaller modules, then run it again:\n\n${result.stdout}${result.stderr}`,
    }),
  );
}
