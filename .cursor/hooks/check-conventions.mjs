#!/usr/bin/env node
// Runs the house-rule checker when the agent stops, and sends any problems back as a follow-up.
import { spawnSync } from "node:child_process";

const result = spawnSync("node", ["scripts/check-conventions.mjs"], { encoding: "utf8" });

if (result.status === 0) {
  console.log("{}");
} else {
  console.log(
    JSON.stringify({
      followup_message: `npm run check:conventions found problems. Fix them, then run it again:\n\n${result.stdout}`,
    }),
  );
}
