import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { migrate } from "./migrate";
import { seed } from "./seed";

export type Db = DatabaseSync;

/** Opens the database, creates tables, and seeds it when it is empty. Use ":memory:" in tests. */
export function openDb(path = ":memory:"): Db {
  if (path !== ":memory:") {
    mkdirSync(dirname(path), { recursive: true });
  }
  const db = new DatabaseSync(path);
  db.exec("PRAGMA foreign_keys = ON;");
  migrate(db);
  seed(db);
  return db;
}

export * from "./books";
export * from "./loans";
export * from "./users";
