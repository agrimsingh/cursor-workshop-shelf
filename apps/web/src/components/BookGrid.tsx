import type { BookView } from "../types";
import { BookCard } from "./BookCard";

type Props = {
  books: BookView[];
  meId: string | null;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
  onJoin: (bookId: string) => void;
  onLeave: (bookId: string) => void;
};

export function BookGrid({ books, meId, ...actions }: Props) {
  if (books.length === 0) return <p className="empty">No books match.</p>;

  return (
    <ul className="grid">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} meId={meId} {...actions} />
        </li>
      ))}
    </ul>
  );
}
