import type { User } from "@shelf/shared";
import { useCallback, useEffect, useState } from "react";
import { BOOK_FIELDS, getCurrentUserId, gql, setCurrentUserId } from "./api";
import { BookGrid } from "./components/BookGrid";
import { NotificationBell } from "./components/NotificationBell";
import { SearchBar } from "./components/SearchBar";
import { UserPicker } from "./components/UserPicker";
import type { BookView } from "./types";

const BOOKS_QUERY = /* GraphQL */ `
  query Books($search: String) {
    books(search: $search) {
      ...BookFields
    }
  }
  ${BOOK_FIELDS}
`;

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [meId, setMeId] = useState<string | null>(getCurrentUserId());
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<BookView[]>([]);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      const data = await gql<{ books: BookView[] }>(BOOKS_QUERY, { search: search || null });
      setBooks(data.books);
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [search]);

  useEffect(() => {
    gql<{ users: User[] }>(`{ users { id name } }`)
      .then((data) => setUsers(data.users))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  const chooseUser = (id: string) => {
    setCurrentUserId(id);
    setMeId(id);
  };

  const runMutation = async (mutation: string, bookId: string) => {
    try {
      await gql(mutation, { bookId });
      await loadBooks();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Shelf</h1>
        <p className="tagline">The team lending library</p>
        <NotificationBell meId={meId} />
        <UserPicker users={users} meId={meId} onChange={chooseUser} />
      </header>

      <div className="toolbar">
        <SearchBar value={search} onChange={setSearch} />
      </div>

      {error && <p className="error">{error}</p>}

      <BookGrid
        books={books}
        meId={meId}
        onBorrow={(id) => runMutation(`mutation ($bookId: ID!) { borrowBook(bookId: $bookId) { id } }`, id)}
        onReturn={(id) => runMutation(`mutation ($bookId: ID!) { returnBook(bookId: $bookId) { id } }`, id)}
      />
    </div>
  );
}
