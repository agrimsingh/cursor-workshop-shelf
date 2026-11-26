import type { BookView } from "../types";

// Part B owns this file. See PARALLEL.md.

export type WaitlistButtonProps = {
  book: BookView;
  meId: string | null;
  onJoin: (bookId: string) => void;
  onLeave: (bookId: string) => void;
};

/** Shown on a book card when the book is on loan to someone else. */
export function WaitlistButton(_props: WaitlistButtonProps) {
  return null;
}
