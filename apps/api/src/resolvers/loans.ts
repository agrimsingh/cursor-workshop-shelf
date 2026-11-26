import { activeLoanForBook, getBook, getUser, insertLoan, markReturned, type LoanRow } from "@shelf/db";
import { AppError, LOAN_DAYS, addDays, lateFeeCents } from "@shelf/shared";
import { requireUser, type Context } from "../context";

export const loansResolvers = {
  Mutation: {
    borrowBook: (_: unknown, args: { bookId: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const bookId = Number(args.bookId);
      if (!getBook(ctx.db, bookId)) throw new AppError("NOT_FOUND", "That book does not exist.");
      if (activeLoanForBook(ctx.db, bookId)) throw new AppError("CONFLICT", "That book is already on loan.");

      const borrowedAt = ctx.now();
      return insertLoan(ctx.db, { bookId, userId, borrowedAt, dueAt: addDays(borrowedAt, LOAN_DAYS) });
    },

    returnBook: (_: unknown, args: { bookId: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const loan = activeLoanForBook(ctx.db, Number(args.bookId));
      if (!loan) throw new AppError("CONFLICT", "That book is not on loan.");
      if (loan.userId !== userId) throw new AppError("FORBIDDEN", "Only the borrower can return this book.");

      return markReturned(ctx.db, loan.id, ctx.now());
    },
  },
  Loan: {
    book: (loan: LoanRow, _: unknown, ctx: Context) => getBook(ctx.db, loan.bookId),
    borrower: (loan: LoanRow, _: unknown, ctx: Context) => getUser(ctx.db, loan.userId),
    overdue: (loan: LoanRow, _: unknown, ctx: Context) => !loan.returnedAt && loan.dueAt < ctx.now(),
    lateFeeCents: (loan: LoanRow, _: unknown, ctx: Context) => lateFeeCents(loan.dueAt, loan.returnedAt ?? ctx.now()),
  },
};
