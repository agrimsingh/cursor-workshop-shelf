import type { BookView } from "../types";

// Part B owns this file. See PARALLEL.md.

export type WaitlistButtonProps = {
  book: BookView;
  meId: string | null;
  onJoin: (bookId: string) => void;
  onLeave: (bookId: string) => void;
};

/** Shown on a book card when the book is on loan to someone else. */
export function WaitlistButton({ book, meId, onJoin, onLeave }: WaitlistButtonProps) {
  if (!meId || !book.currentLoan || book.currentLoan.borrower.id === meId) return null;

  const waiting = book.waitlist.length;

  if (book.myWaitlistPosition) {
    return (
      <div className="waitlist">
        <span className="waitlist-place">You're #{book.myWaitlistPosition} in line</span>
        <button className="secondary" onClick={() => onLeave(book.id)}>
          Leave
        </button>
      </div>
    );
  }

  return (
    <div className="waitlist">
      {waiting > 0 && <span className="waitlist-count">{waiting} waiting</span>}
      <button onClick={() => onJoin(book.id)}>Join waitlist</button>
    </div>
  );
}
