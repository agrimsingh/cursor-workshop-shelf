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

export function createNotification(
  db: DatabaseSync,
  notification: { userId: string; bookId: number; message: string; createdAt: string },
): NotificationRow {
  throw new Error("Not implemented yet (Part C): createNotification");
}

/** Newest first. */
export function notificationsForUser(db: DatabaseSync, userId: string): NotificationRow[] {
  throw new Error("Not implemented yet (Part C): notificationsForUser");
}

export function getNotification(db: DatabaseSync, id: number): NotificationRow | undefined {
  throw new Error("Not implemented yet (Part C): getNotification");
}

export function markNotificationRead(db: DatabaseSync, id: number, readAt: string): NotificationRow {
  throw new Error("Not implemented yet (Part C): markNotificationRead");
}
