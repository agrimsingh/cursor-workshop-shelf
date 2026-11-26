import type { DatabaseSync } from "node:sqlite";

const SCHEMA = `
CREATE TABLE IF NOT EXISTS users (
  id    TEXT PRIMARY KEY,
  name  TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS books (
  id          INTEGER PRIMARY KEY,
  title       TEXT    NOT NULL,
  author      TEXT    NOT NULL,
  year        INTEGER NOT NULL,
  cover_color TEXT    NOT NULL
);

CREATE TABLE IF NOT EXISTS loans (
  id          INTEGER PRIMARY KEY,
  book_id     INTEGER NOT NULL REFERENCES books(id),
  user_id     TEXT    NOT NULL REFERENCES users(id),
  borrowed_at TEXT    NOT NULL,
  due_at      TEXT    NOT NULL,
  returned_at TEXT
);

CREATE UNIQUE INDEX IF NOT EXISTS one_active_loan_per_book
  ON loans(book_id) WHERE returned_at IS NULL;
`;

export function migrate(db: DatabaseSync): void {
  db.exec(SCHEMA);
  addColumnIfMissing(db, "loans", "renewals", "INTEGER NOT NULL DEFAULT 0");
}

function addColumnIfMissing(db: DatabaseSync, table: string, column: string, definition: string): void {
  const columns = db.prepare(`PRAGMA table_info(${table})`).all() as { name: string }[];
  if (!columns.some((c) => c.name === column)) {
    db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
  }
}
