import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const RULES = [
  {
    dir: "apps/web/src",
    pattern: /\.toLocale(Date|Time)?String\(|\.toDateString\(/,
    rule: "Show dates with formatDate from @shelf/shared.",
  },
  {
    dir: "apps/api/src",
    pattern: /throw new Error\(/,
    rule: "Throw AppError(code, message) from @shelf/shared, not a plain Error.",
  },
  {
    dir: "apps/api/src",
    pattern: /\.prepare\(|\.exec\(|\bSELECT\b|\bINSERT\b|\bUPDATE\b/,
    rule: "Keep SQL in packages/db. Resolvers call db functions.",
  },
];

const sourceFiles = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name);
    if (statSync(path).isDirectory()) return sourceFiles(path);
    return /\.tsx?$/.test(name) && !/\.test\.tsx?$/.test(name) && name !== "testing.ts" ? [path] : [];
  });

const violations = [];

for (const { dir, pattern, rule } of RULES) {
  for (const file of sourceFiles(dir)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        if (pattern.test(line)) violations.push(`${file}:${i + 1}  ${rule}\n    ${line.trim()}`);
      });
  }
}

if (!existsSync("AGENTS.md")) {
  violations.push("AGENTS.md  Missing. Write one so every agent knows the house rules.");
}

if (violations.length) {
  console.log(`❌ ${violations.length} convention issue(s):\n`);
  console.log(violations.join("\n\n"));
  process.exit(1);
}
console.log("✅ Conventions look good.");
