import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { openDb } from "./index";
import { addColumnIfMissing } from "./migrate";

const dirs: string[] = [];

function tempDbPath(): string {
  const dir = mkdtempSync(join(tmpdir(), "shelf-db-"));
  dirs.push(dir);
  return join(dir, "shelf.db");
}

function columnNames(db: DatabaseSync, table: string): string[] {
  return (db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[]).map((c) => c.name);
}

afterEach(() => {
  for (const dir of dirs.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("addColumnIfMissing", () => {
  it("adds a column to a table in an existing database and backfills the default", () => {
    const path = tempDbPath();
    openDb(path).close();

    const db = new DatabaseSync(path);
    expect(columnNames(db, "loans")).not.toContain("renewals");

    addColumnIfMissing(db, "loans", "renewals", "INTEGER NOT NULL DEFAULT 0");

    expect(columnNames(db, "loans")).toContain("renewals");
    const rows = db.prepare("SELECT renewals FROM loans").all() as { renewals: number }[];
    expect(rows.length).toBeGreaterThan(0);
    expect(rows.every((r) => r.renewals === 0)).toBe(true);
    db.close();
  });

  it("does nothing when the column already exists", () => {
    const db = openDb(":memory:");
    addColumnIfMissing(db, "loans", "renewals", "INTEGER NOT NULL DEFAULT 0");
    expect(() => addColumnIfMissing(db, "loans", "renewals", "INTEGER NOT NULL DEFAULT 0")).not.toThrow();
    expect(columnNames(db, "loans").filter((c) => c === "renewals")).toHaveLength(1);
  });
});
