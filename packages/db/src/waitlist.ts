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
  throw new Error("Not implemented yet (Part A): waitlistForBook");
}

export function addToWaitlist(
  db: DatabaseSync,
  entry: { bookId: number; userId: string; joinedAt: string },
): WaitlistRow {
  throw new Error("Not implemented yet (Part A): addToWaitlist");
}

/** Returns true when the user was on the waitlist. */
export function removeFromWaitlist(db: DatabaseSync, entry: { bookId: number; userId: string }): boolean {
  throw new Error("Not implemented yet (Part A): removeFromWaitlist");
}
