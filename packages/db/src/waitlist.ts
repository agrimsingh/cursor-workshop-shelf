import type { DatabaseSync } from "node:sqlite";

// Part A owns this file. See PARALLEL.md. Keep these signatures: parts B and C code against them.

export type WaitlistRow = {
  id: number;
  bookId: number;
  userId: string;
  joinedAt: string;
  /** 1 is next in line. */
  position: number;
};

/** Everyone waiting for a book, next in line first (earliest joinedAt, then lowest id). */
export function waitlistForBook(db: DatabaseSync, bookId: number): WaitlistRow[] {
  return db
    .prepare(
      `SELECT id, book_id AS bookId, user_id AS userId, joined_at AS joinedAt,
              ROW_NUMBER() OVER (ORDER BY joined_at, id) AS position
         FROM waitlist
        WHERE book_id = ?
        ORDER BY position`,
    )
    .all(bookId) as WaitlistRow[];
}

export function addToWaitlist(
  db: DatabaseSync,
  entry: { bookId: number; userId: string; joinedAt: string },
): WaitlistRow {
  db.prepare("INSERT INTO waitlist (book_id, user_id, joined_at) VALUES (?, ?, ?)").run(
    entry.bookId,
    entry.userId,
    entry.joinedAt,
  );
  return waitlistForBook(db, entry.bookId).find((row) => row.userId === entry.userId)!;
}

/** Returns true when the user was on the waitlist. */
export function removeFromWaitlist(db: DatabaseSync, entry: { bookId: number; userId: string }): boolean {
  const { changes } = db
    .prepare("DELETE FROM waitlist WHERE book_id = ? AND user_id = ?")
    .run(entry.bookId, entry.userId);
  return Number(changes) > 0;
}
