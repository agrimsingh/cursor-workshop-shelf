import type { BookCondition } from "@shelf/shared";
import type { DatabaseSync, SQLInputValue } from "node:sqlite";

export type BookRow = {
  id: number;
  title: string;
  author: string;
  year: number;
  coverColor: string;
  condition: BookCondition;
};

const COLUMNS = "id, title, author, year, cover_color AS coverColor, condition";

export type BookFilter = {
  search?: string;
  condition?: BookCondition;
};

export function listBooks(db: DatabaseSync, filter: BookFilter = {}): BookRow[] {
  const where: string[] = [];
  const params: SQLInputValue[] = [];

  if (filter.search) {
    const pattern = `%${filter.search}%`;
    where.push("(title LIKE ? OR author LIKE ?)");
    params.push(pattern, pattern);
  }
  if (filter.condition) {
    where.push("condition = ?");
    params.push(filter.condition);
  }

  const clause = where.length ? `WHERE ${where.join(" AND ")}` : "";
  return db.prepare(`SELECT ${COLUMNS} FROM books ${clause} ORDER BY title`).all(...params) as BookRow[];
}

export function getBook(db: DatabaseSync, id: number): BookRow | undefined {
  return db.prepare(`SELECT ${COLUMNS} FROM books WHERE id = ?`).get(id) as BookRow | undefined;
}
