import type { DatabaseSync } from "node:sqlite";

const USERS = [
  ["ada", "Ada Lovelace", "ada@shelf.test"],
  ["grace", "Grace Hopper", "grace@shelf.test"],
  ["linus", "Linus Torvalds", "linus@shelf.test"],
  ["margaret", "Margaret Hamilton", "margaret@shelf.test"],
] as const;

const BOOKS = [
  ["The Pragmatic Programmer", "Andrew Hunt and David Thomas", 1999, "#2f6f4e", "WORN"],
  ["Designing Data-Intensive Applications", "Martin Kleppmann", 2017, "#8a3b12", "GOOD"],
  ["A Philosophy of Software Design", "John Ousterhout", 2018, "#1f4e79", "NEW"],
  ["Refactoring", "Martin Fowler", 2018, "#6b2d5c", "GOOD"],
  ["The Mythical Man-Month", "Frederick P. Brooks Jr.", 1975, "#7a6a12", "WORN"],
  ["Thinking in Systems", "Donella H. Meadows", 2008, "#245a5a", "GOOD"],
  ["Accelerate", "Nicole Forsgren, Jez Humble and Gene Kim", 2018, "#a23e48", "NEW"],
  ["Working Effectively with Legacy Code", "Michael Feathers", 2004, "#4a4a4a", "WORN"],
  ["Structure and Interpretation of Computer Programs", "Harold Abelson and Gerald Jay Sussman", 1985, "#5b3a8c", "GOOD"],
  ["The Design of Everyday Things", "Don Norman", 1988, "#c26d1a", "WORN"],
  ["Shape Up", "Ryan Singer", 2019, "#2d6a8c", "NEW"],
  ["Inspired", "Marty Cagan", 2008, "#7c8c2d", "GOOD"],
] as const;

/** Active loans as [bookId, userId, borrowedAt, dueAt]. Book 5 is overdue on purpose. */
const LOANS = [
  [2, "grace", "2026-11-20T09:00:00.000Z", "2026-12-04T09:00:00.000Z"],
  [5, "linus", "2026-11-01T09:00:00.000Z", "2026-11-15T09:00:00.000Z"],
  [7, "ada", "2026-11-24T09:00:00.000Z", "2026-12-08T09:00:00.000Z"],
  [10, "margaret", "2026-11-18T09:00:00.000Z", "2026-12-02T09:00:00.000Z"],
] as const;

export function seed(db: DatabaseSync): void {
  const { count } = db.prepare("SELECT COUNT(*) AS count FROM books").get() as { count: number };
  if (count > 0) return;

  const insertUser = db.prepare("INSERT INTO users (id, name, email) VALUES (?, ?, ?)");
  const insertBook = db.prepare(
    "INSERT INTO books (title, author, year, cover_color, condition) VALUES (?, ?, ?, ?, ?)",
  );
  const insertLoan = db.prepare("INSERT INTO loans (book_id, user_id, borrowed_at, due_at) VALUES (?, ?, ?, ?)");

  db.exec("BEGIN");
  for (const user of USERS) insertUser.run(...user);
  for (const book of BOOKS) insertBook.run(...book);
  for (const loan of LOANS) insertLoan.run(...loan);
  db.exec("COMMIT");
}
