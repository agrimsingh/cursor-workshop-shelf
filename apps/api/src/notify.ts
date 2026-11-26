import type { Context } from "./context";

// Part C owns this file. See PARALLEL.md.

/**
 * Called by returnBook after a loan is marked returned.
 * Notifies the next person on the book's waitlist and takes them off the list.
 */
export function notifyNextInLine(ctx: Context, bookId: number): void {
  // Not implemented yet (Part C). Left as a no-op so returning books keeps working.
}
