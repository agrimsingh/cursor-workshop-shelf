import type { DatabaseSync } from "node:sqlite";

export type ReviewRow = {
  id: number;
  bookId: number;
  userId: string;
  rating: number;
  body: string;
  createdAt: string;
};

const COLUMNS = "id, book_id AS bookId, user_id AS userId, rating, body, created_at AS createdAt";

export function insertReview(
  db: DatabaseSync,
  review: { bookId: number; userId: string; rating: number; body: string; createdAt: string },
): ReviewRow {
  const { lastInsertRowid } = db
    .prepare("INSERT INTO reviews (book_id, user_id, rating, body, created_at) VALUES (?, ?, ?, ?, ?)")
    .run(review.bookId, review.userId, review.rating, review.body, review.createdAt);
  return db.prepare(`SELECT ${COLUMNS} FROM reviews WHERE id = ?`).get(Number(lastInsertRowid)) as ReviewRow;
}

export function reviewsForBook(db: DatabaseSync, bookId: number): ReviewRow[] {
  return db
    .prepare(`SELECT ${COLUMNS} FROM reviews WHERE book_id = ? ORDER BY created_at DESC`)
    .all(bookId) as ReviewRow[];
}

export function searchReviews(db: DatabaseSync, text: string): ReviewRow[] {
  return db
    .prepare(`SELECT ${COLUMNS} FROM reviews WHERE body LIKE ? ORDER BY created_at DESC`)
    .all(`%${text}%`) as ReviewRow[];
}

export function ratingTotals(db: DatabaseSync, bookId: number): { total: number; count: number } {
  return db
    .prepare("SELECT COALESCE(SUM(rating), 0) AS total, COUNT(*) AS count FROM reviews WHERE book_id = ?")
    .get(bookId) as { total: number; count: number };
}
