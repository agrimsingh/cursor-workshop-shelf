import type { DatabaseSync } from "node:sqlite";

// Part C owns this file. See PARALLEL.md. Keep these signatures.

export type NotificationRow = {
  id: number;
  userId: string;
  bookId: number;
  message: string;
  createdAt: string;
  readAt: string | null;
};

const COLUMNS =
  "id, user_id AS userId, book_id AS bookId, message, created_at AS createdAt, read_at AS readAt";

export function createNotification(
  db: DatabaseSync,
  notification: { userId: string; bookId: number; message: string; createdAt: string },
): NotificationRow {
  const { lastInsertRowid } = db
    .prepare("INSERT INTO notifications (user_id, book_id, message, created_at) VALUES (?, ?, ?, ?)")
    .run(notification.userId, notification.bookId, notification.message, notification.createdAt);
  return getNotification(db, Number(lastInsertRowid))!;
}

/** Newest first. */
export function notificationsForUser(db: DatabaseSync, userId: string): NotificationRow[] {
  return db
    .prepare(`SELECT ${COLUMNS} FROM notifications WHERE user_id = ? ORDER BY created_at DESC, id DESC`)
    .all(userId) as NotificationRow[];
}

export function getNotification(db: DatabaseSync, id: number): NotificationRow | undefined {
  return db.prepare(`SELECT ${COLUMNS} FROM notifications WHERE id = ?`).get(id) as NotificationRow | undefined;
}

export function markNotificationRead(db: DatabaseSync, id: number, readAt: string): NotificationRow {
  db.prepare("UPDATE notifications SET read_at = COALESCE(read_at, ?) WHERE id = ?").run(readAt, id);
  return getNotification(db, id)!;
}
