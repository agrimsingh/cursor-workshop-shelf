import { activeLoanForBook, getBook, listBooks, type BookRow } from "@shelf/db";
import type { BookCondition } from "@shelf/shared";
import type { Context } from "../context";

export const booksResolvers = {
  Query: {
    books: (_: unknown, args: { search?: string | null; condition?: BookCondition | null }, ctx: Context) =>
      listBooks(ctx.db, { search: args.search ?? undefined, condition: args.condition ?? undefined }),
    book: (_: unknown, args: { id: string }, ctx: Context) => getBook(ctx.db, Number(args.id)) ?? null,
  },
  Book: {
    available: (book: BookRow, _: unknown, ctx: Context) => !activeLoanForBook(ctx.db, book.id),
    currentLoan: (book: BookRow, _: unknown, ctx: Context) => activeLoanForBook(ctx.db, book.id) ?? null,
  },
};
