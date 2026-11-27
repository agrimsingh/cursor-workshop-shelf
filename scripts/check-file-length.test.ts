import { describe, expect, it } from "vitest";
import { countCodeLines, findOverLimit } from "./check-file-length.mjs";

describe("countCodeLines", () => {
  it("counts code lines and skips blank lines", () => {
    expect(countCodeLines("const a = 1;\n\n   \nconst b = 2;\n")).toBe(2);
  });

  it("counts a last line without a trailing newline", () => {
    expect(countCodeLines("a();\nb();")).toBe(2);
  });

  it("skips // line comments but counts code before them", () => {
    expect(countCodeLines("// header\na(); // trailing\n  // indented\n")).toBe(1);
  });

  it("skips /* */ block comments, including multi-line ones", () => {
    const source = ["/**", " * Docs", " */", "a();", "/* one-liner */", "b(); /* tail", "still comment */", "c();"].join("\n");
    expect(countCodeLines(source)).toBe(3);
  });

  it("counts code that follows a block comment on the same line", () => {
    expect(countCodeLines("/* note */ a();\n")).toBe(1);
  });

  it("ignores comment markers inside strings", () => {
    const source = ['const url = "http://example.com";', "const glob = 'src/*.ts';", "const t = `/* not a comment */`;"].join("\n");
    expect(countCodeLines(source)).toBe(3);
  });

  it("counts every line of a multi-line template literal", () => {
    expect(countCodeLines("const s = `\n  // inside\n`;\n")).toBe(3);
  });

  it("handles escaped quotes in strings", () => {
    expect(countCodeLines('const s = "a \\" // b";\n// c\n')).toBe(1);
  });

  it("treats // as code in CSS and skips /* */ comments", () => {
    const source = ["/* theme */", ".a {", "  background: url(//cdn.example.com/x.png);", "}"].join("\n");
    expect(countCodeLines(source, "styles.css")).toBe(3);
  });
});

describe("findOverLimit", () => {
  it("reports only files over the limit", () => {
    const files: Record<string, string> = {
      "small.ts": "a();\nb();\n",
      "big.ts": "a();\n".repeat(4),
      "commented.ts": "// x\n".repeat(10) + "a();\n",
    };
    expect(findOverLimit(Object.keys(files), (file: string) => files[file] ?? "", 3)).toEqual([
      { file: "big.ts", lines: 4 },
    ]);
  });
});
