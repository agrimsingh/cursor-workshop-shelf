import type { DatabaseSync } from "node:sqlite";

export type BookRow = {
  id: number;
  title: string;
  author: string;
  year: number;
  coverColor: string;
};

const COLUMNS = "id, title, author, year, cover_color AS coverColor";

export type BookFilter = {
  search?: string;
};

export function listBooks(db: DatabaseSync, filter: BookFilter = {}): BookRow[] {
  if (filter.search) {
    const pattern = `%${filter.search}%`;
    return db
      .prepare(`SELECT ${COLUMNS} FROM books WHERE title LIKE ? OR author LIKE ? ORDER BY title`)
      .all(pattern, pattern) as BookRow[];
  }
  return db.prepare(`SELECT ${COLUMNS} FROM books ORDER BY title`).all() as BookRow[];
}

export function getBook(db: DatabaseSync, id: number): BookRow | undefined {
  return db.prepare(`SELECT ${COLUMNS} FROM books WHERE id = ?`).get(id) as BookRow | undefined;
}
