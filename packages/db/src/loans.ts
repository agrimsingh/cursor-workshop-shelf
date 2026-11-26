import type { DatabaseSync } from "node:sqlite";

export type LoanRow = {
  id: number;
  bookId: number;
  userId: string;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

const COLUMNS =
  "id, book_id AS bookId, user_id AS userId, borrowed_at AS borrowedAt, due_at AS dueAt, returned_at AS returnedAt";

export function activeLoanForBook(db: DatabaseSync, bookId: number): LoanRow | undefined {
  return db
    .prepare(`SELECT ${COLUMNS} FROM loans WHERE book_id = ? AND returned_at IS NULL`)
    .get(bookId) as LoanRow | undefined;
}

export function loansForUser(db: DatabaseSync, userId: string): LoanRow[] {
  return db
    .prepare(`SELECT ${COLUMNS} FROM loans WHERE user_id = ? ORDER BY borrowed_at DESC`)
    .all(userId) as LoanRow[];
}

export function insertLoan(
  db: DatabaseSync,
  loan: { bookId: number; userId: string; borrowedAt: string; dueAt: string },
): LoanRow {
  const { lastInsertRowid } = db
    .prepare("INSERT INTO loans (book_id, user_id, borrowed_at, due_at) VALUES (?, ?, ?, ?)")
    .run(loan.bookId, loan.userId, loan.borrowedAt, loan.dueAt);
  return getLoan(db, Number(lastInsertRowid))!;
}

export function markReturned(db: DatabaseSync, loanId: number, returnedAt: string): LoanRow {
  db.prepare("UPDATE loans SET returned_at = ? WHERE id = ?").run(returnedAt, loanId);
  return getLoan(db, loanId)!;
}

export function getLoan(db: DatabaseSync, id: number): LoanRow | undefined {
  return db.prepare(`SELECT ${COLUMNS} FROM loans WHERE id = ?`).get(id) as LoanRow | undefined;
}
