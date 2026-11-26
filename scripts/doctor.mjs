import { execSync } from "node:child_process";
import { existsSync } from "node:fs";
import { createServer } from "node:net";

const results = [];
const check = (name, ok, fix) => results.push({ name, ok, fix });

const [major, minor] = process.versions.node.split(".").map(Number);
check(
  `Node ${process.versions.node}`,
  major > 22 || (major === 22 && minor >= 13),
  "Install Node 22.13 or later (https://nodejs.org).",
);

try {
  await import("node:sqlite");
  check("Built-in SQLite", true);
} catch {
  check("Built-in SQLite", false, "Upgrade Node to 22.13 or later.");
}

check("Dependencies installed", existsSync("node_modules/graphql-yoga"), "Run npm install.");

try {
  execSync("git --version", { stdio: "ignore" });
  check("git", true);
} catch {
  check("git", false, "Install git.");
}

const portFree = (port) =>
  new Promise((resolve) => {
    const server = createServer()
      .once("error", () => resolve(false))
      .once("listening", () => server.close(() => resolve(true)))
      .listen(port);
  });

for (const port of [4000, 5173]) {
  check(`Port ${port} free`, await portFree(port), `Stop whatever is using port ${port}, or ignore this if Shelf is already running.`);
}

for (const { name, ok, fix } of results) {
  console.log(`${ok ? "✅" : "❌"} ${name}${ok ? "" : `  →  ${fix}`}`);
}

const failed = results.filter((r) => !r.ok).length;
console.log(failed ? `\n${failed} check(s) need attention.` : "\nAll set. Run npm run dev and open http://localhost:5173");
process.exit(failed ? 1 : 0);
