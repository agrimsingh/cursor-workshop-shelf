import { formatDate } from "@shelf/shared";
import type { BookView } from "../types";
import { WaitlistButton } from "./WaitlistButton";

type Props = {
  book: BookView;
  meId: string | null;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onJoin: (bookId: string) => void;
  onLeave: (bookId: string) => void;
};

export function BookCard({ book, meId, onBorrow, onReturn, onJoin, onLeave }: Props) {
  const loan = book.currentLoan;
  const isMine = loan?.borrower.id === meId;

  return (
    <article className="card">
      <div className="cover" style={{ background: book.coverColor }}>
        <span>{book.title}</span>
      </div>
      <div className="details">
        <h2>{book.title}</h2>
        <p className="meta">
          {book.author} · {book.year}
        </p>

        {loan ? (
          <p className={loan.overdue ? "status overdue" : "status on-loan"}>
            {loan.overdue ? "Overdue" : "On loan"} · {isMine ? "you" : loan.borrower.name} · due {formatDate(loan.dueAt)}
          </p>
        ) : (
          <p className="status available">Available</p>
        )}

        {!loan && (
          <button disabled={!meId} onClick={() => onBorrow(book.id)}>
            Borrow
          </button>
        )}
        {loan && isMine && <button onClick={() => onReturn(book.id)}>Return</button>}
        <WaitlistButton book={book} meId={meId} onJoin={onJoin} onLeave={onLeave} />
      </div>
    </article>
  );
}
