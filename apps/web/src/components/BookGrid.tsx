import type { BookView } from "../types";
import { BookCard } from "./BookCard";

type Props = {
  books: BookView[];
  meId: string | null;
  onBorrow: (bookId: string) => void;
  onReturn: (bookId: string) => void;
};

export function BookGrid({ books, meId, onBorrow, onReturn }: Props) {
  if (books.length === 0) return <p className="empty">No books match.</p>;

  return (
    <ul className="grid">
      {books.map((book) => (
        <li key={book.id}>
          <BookCard book={book} meId={meId} onBorrow={onBorrow} onReturn={onReturn} />
        </li>
      ))}
    </ul>
  );
}
