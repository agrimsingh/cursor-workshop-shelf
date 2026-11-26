import { createNotification, getBook, removeFromWaitlist, waitlistForBook } from "@shelf/db";
import type { Context } from "./context";

// Part C owns this file. See PARALLEL.md.

/**
 * Called by returnBook after a loan is marked returned.
 * Notifies the next person on the book's waitlist and takes them off the list.
 */
export function notifyNextInLine(ctx: Context, bookId: number): void {
  const next = waitlistForBook(ctx.db, bookId)[0];
  const book = getBook(ctx.db, bookId);
  if (!next || !book) return;

  createNotification(ctx.db, {
    userId: next.userId,
    bookId,
    message: `${book.title} is back. You're next in line.`,
    createdAt: ctx.now(),
  });
  removeFromWaitlist(ctx.db, { bookId, userId: next.userId });
}
