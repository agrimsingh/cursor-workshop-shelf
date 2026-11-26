import {
  activeLoanForBook,
  addToWaitlist,
  getBook,
  getUser,
  removeFromWaitlist,
  waitlistForBook,
  type BookRow,
  type WaitlistRow,
} from "@shelf/db";
import { AppError } from "@shelf/shared";
import { requireUser, type Context } from "../context";

// Part A owns this file. See PARALLEL.md.

export const waitlistResolvers = {
  Book: {
    waitlist: (book: BookRow, _: unknown, ctx: Context) => waitlistForBook(ctx.db, book.id),
    myWaitlistPosition: (book: BookRow, _: unknown, ctx: Context) =>
      waitlistForBook(ctx.db, book.id).find((row) => row.userId === ctx.userId)?.position ?? null,
  },
  WaitlistEntry: {
    user: (row: WaitlistRow, _: unknown, ctx: Context) => getUser(ctx.db, row.userId),
  },
  Mutation: {
    joinWaitlist: (_: unknown, args: { bookId: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const bookId = Number(args.bookId);
      if (!getBook(ctx.db, bookId)) throw new AppError("NOT_FOUND", "That book does not exist.");

      const loan = activeLoanForBook(ctx.db, bookId);
      if (!loan) throw new AppError("CONFLICT", "That book is available. Borrow it instead.");
      if (loan.userId === userId) throw new AppError("CONFLICT", "You already have this book.");
      if (waitlistForBook(ctx.db, bookId).some((row) => row.userId === userId)) {
        throw new AppError("CONFLICT", "You are already on the waitlist.");
      }

      return addToWaitlist(ctx.db, { bookId, userId, joinedAt: ctx.now() });
    },

    leaveWaitlist: (_: unknown, args: { bookId: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      return removeFromWaitlist(ctx.db, { bookId: Number(args.bookId), userId });
    },
  },
};
