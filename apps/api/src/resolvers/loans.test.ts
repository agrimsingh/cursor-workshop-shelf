import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

const BORROW = `mutation ($id: ID!) { borrowBook(bookId: $id) { dueAt borrower { id } } }`;
const RETURN = `mutation ($id: ID!) { returnBook(bookId: $id) { returnedAt } }`;

describe("loans", () => {
  it("borrows an available book for 14 days", async () => {
    const api = testApi();
    const { data } = await api.query(BORROW, { id: "1" }, "ada");
    expect(data?.borrowBook).toEqual({ dueAt: "2026-12-11T00:00:00.000Z", borrower: { id: "ada" } });
  });

  it("refuses to lend a book that is already on loan", async () => {
    const api = testApi();
    const { errors } = await api.query(BORROW, { id: "2" }, "ada");
    expect(errors?.[0]?.extensions?.code).toBe("CONFLICT");
  });

  it("requires a signed-in user", async () => {
    const api = testApi();
    const { errors } = await api.query(BORROW, { id: "1" });
    expect(errors?.[0]?.extensions?.code).toBe("UNAUTHENTICATED");
  });

  it("only lets the borrower return a book", async () => {
    const api = testApi();
    const wrongUser = await api.query(RETURN, { id: "2" }, "ada");
    expect(wrongUser.errors?.[0]?.extensions?.code).toBe("FORBIDDEN");

    const borrower = await api.query(RETURN, { id: "2" }, "grace");
    expect(borrower.data?.returnBook.returnedAt).toBe("2026-11-27T00:00:00.000Z");
  });

  it("marks past-due loans as overdue", async () => {
    const api = testApi();
    const { data } = await api.query(`{ book(id: "5") { currentLoan { overdue } } }`);
    expect(data?.book.currentLoan.overdue).toBe(true);
  });
});
