import {
  activeLoanForBook,
  getBook,
  getUser,
  insertLoan,
  loansForUser,
  markReturned,
  renewLoan,
  type LoanRow,
} from "@shelf/db";
import { AppError, LOAN_DAYS, MAX_RENEWALS, addDays, lateFeeCents } from "@shelf/shared";
import { requireUser, type Context } from "../context";

const isOverdue = (loan: LoanRow, now: string) => !loan.returnedAt && loan.dueAt < now;

export const loansResolvers = {
  Query: {
    myLoans: (_: unknown, __: unknown, ctx: Context) => (ctx.userId ? loansForUser(ctx.db, ctx.userId) : []),
  },
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

    renewLoan: (_: unknown, args: { bookId: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const loan = activeLoanForBook(ctx.db, Number(args.bookId));
      if (!loan) throw new AppError("CONFLICT", "That book is not on loan.");
      if (loan.userId !== userId) throw new AppError("FORBIDDEN", "Only the borrower can renew this loan.");
      if (isOverdue(loan, ctx.now())) throw new AppError("CONFLICT", "Overdue loans can't be renewed. Return the book.");
      if (loan.renewals >= MAX_RENEWALS) throw new AppError("CONFLICT", "This loan has already been renewed.");

      return renewLoan(ctx.db, loan.id, addDays(loan.dueAt, LOAN_DAYS));
    },
  },
  Loan: {
    book: (loan: LoanRow, _: unknown, ctx: Context) => getBook(ctx.db, loan.bookId),
    borrower: (loan: LoanRow, _: unknown, ctx: Context) => getUser(ctx.db, loan.userId),
    overdue: (loan: LoanRow, _: unknown, ctx: Context) => isOverdue(loan, ctx.now()),
    lateFeeCents: (loan: LoanRow, _: unknown, ctx: Context) => lateFeeCents(loan.dueAt, loan.returnedAt ?? ctx.now()),
  },
};
