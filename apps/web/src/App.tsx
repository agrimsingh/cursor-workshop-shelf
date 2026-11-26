import type { User } from "@shelf/shared";
import { useCallback, useEffect, useState } from "react";
import { BOOK_FIELDS, getCurrentUserId, gql, setCurrentUserId } from "./api";
import { BookGrid } from "./components/BookGrid";
import { MyLoans } from "./components/MyLoans";
import { SearchBar } from "./components/SearchBar";
import { UserPicker } from "./components/UserPicker";
import type { BookView, MyLoanView } from "./types";

const BOOKS_QUERY = /* GraphQL */ `
  query Books($search: String) {
    books(search: $search) {
      ...BookFields
    }
  }
  ${BOOK_FIELDS}
`;

const MY_LOANS_QUERY = /* GraphQL */ `
  {
    myLoans {
      id
      borrowedAt
      dueAt
      returnedAt
      overdue
      lateFeeCents
      renewals
      book {
        id
        title
      }
    }
  }
`;

type View = "books" | "loans";

export function App() {
  const [users, setUsers] = useState<User[]>([]);
  const [meId, setMeId] = useState<string | null>(getCurrentUserId());
  const [view, setView] = useState<View>("books");
  const [search, setSearch] = useState("");
  const [books, setBooks] = useState<BookView[]>([]);
  const [loans, setLoans] = useState<MyLoanView[]>([]);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      if (view === "books") {
        const data = await gql<{ books: BookView[] }>(BOOKS_QUERY, { search: search || null });
        setBooks(data.books);
      } else {
        const data = await gql<{ myLoans: MyLoanView[] }>(MY_LOANS_QUERY);
        setLoans(data.myLoans);
      }
      setError(null);
    } catch (e) {
      setError((e as Error).message);
    }
  }, [search, view, meId]);

  useEffect(() => {
    gql<{ users: User[] }>(`{ users { id name } }`)
      .then((data) => setUsers(data.users))
      .catch((e: Error) => setError(e.message));
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const chooseUser = (id: string) => {
    setCurrentUserId(id);
    setMeId(id);
  };

  const runMutation = async (mutation: string, bookId: string) => {
    try {
      await gql(mutation, { bookId });
      await load();
    } catch (e) {
      setError((e as Error).message);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Shelf</h1>
        <p className="tagline">The team lending library</p>
        <nav className="tabs">
          <button className={view === "books" ? "active" : ""} onClick={() => setView("books")}>
            Books
          </button>
          <button className={view === "loans" ? "active" : ""} disabled={!meId} onClick={() => setView("loans")}>
            My loans
          </button>
        </nav>
        <UserPicker users={users} meId={meId} onChange={chooseUser} />
      </header>

      {error && <p className="error">{error}</p>}

      {view === "books" ? (
        <>
          <div className="toolbar">
            <SearchBar value={search} onChange={setSearch} />
          </div>
          <BookGrid
            books={books}
            meId={meId}
            onBorrow={(id) => runMutation(`mutation ($bookId: ID!) { borrowBook(bookId: $bookId) { id } }`, id)}
            onReturn={(id) => runMutation(`mutation ($bookId: ID!) { returnBook(bookId: $bookId) { id } }`, id)}
          />
        </>
      ) : (
        <MyLoans
          loans={loans}
          onRenew={(id) => runMutation(`mutation ($bookId: ID!) { renewLoan(bookId: $bookId) { id } }`, id)}
        />
      )}
    </div>
  );
}
