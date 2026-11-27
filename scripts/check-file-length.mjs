import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

export const MAX_LINES = 500;

const INCLUDE = /^(apps|packages|scripts|checks)\/.*\.(tsx?|m?js|css)$/;
const EXCLUDE = /\.d\.ts$/;

// Counts lines that hold something other than whitespace and comments.
// Regex literals are treated as code, so a regex containing a quote or comment marker can miscount.
export function countCodeLines(source, file = "file.ts") {
  const lineComments = !file.endsWith(".css");
  let count = 0;
  let hasCode = false;
  let state = "code";
  let quote = "";

  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    const next = source[i + 1];

    if (ch === "\n") {
      if (hasCode) count++;
      hasCode = false;
      if (state === "line") state = "code";
      continue;
    }

    if (state === "line") continue;

    if (state === "block") {
      if (ch === "*" && next === "/") {
        state = "code";
        i++;
      }
      continue;
    }

    if (state === "string") {
      if (!/\s/.test(ch)) hasCode = true;
      if (ch === "\\") i++;
      else if (ch === quote) state = "code";
      continue;
    }

    if (ch === "/" && next === "*") {
      state = "block";
      i++;
    } else if (lineComments && ch === "/" && next === "/") {
      state = "line";
    } else if (!/\s/.test(ch)) {
      hasCode = true;
      if (ch === '"' || ch === "'" || ch === "`") {
        state = "string";
        quote = ch;
      }
    }
  }

  return hasCode ? count + 1 : count;
}

export function sourceFiles() {
  return execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard"], { encoding: "utf8" })
    .split("\n")
    .filter((file) => INCLUDE.test(file) && !EXCLUDE.test(file));
}

export function findOverLimit(files, read = (file) => readFileSync(file, "utf8"), max = MAX_LINES) {
  return files
    .map((file) => ({ file, lines: countCodeLines(read(file), file) }))
    .filter(({ lines }) => lines > max);
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  const over = findOverLimit(sourceFiles().filter((file) => existsSync(file)));

  if (over.length) {
    console.log(`❌ ${over.length} file(s) over ${MAX_LINES} lines of code. Split them up:\n`);
    for (const { file, lines } of over) console.log(`  ${file}  ${lines} lines`);
    process.exit(1);
  }
  console.log(`✅ All source files are ${MAX_LINES} lines of code or fewer.`);
}
