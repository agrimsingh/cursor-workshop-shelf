import { activeLoanForBook, getBook, listBooks, type BookRow } from "@shelf/db";
import type { Context } from "../context";

export const booksResolvers = {
  Query: {
    books: (_: unknown, args: { search?: string | null }, ctx: Context) =>
      listBooks(ctx.db, { search: args.search ?? undefined }),
    book: (_: unknown, args: { id: string }, ctx: Context) => getBook(ctx.db, Number(args.id)) ?? null,
  },
  Book: {
    available: (book: BookRow, _: unknown, ctx: Context) => !activeLoanForBook(ctx.db, book.id),
    currentLoan: (book: BookRow, _: unknown, ctx: Context) => activeLoanForBook(ctx.db, book.id) ?? null,
  },
};
