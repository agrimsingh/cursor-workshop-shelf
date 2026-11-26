import type { Book, Loan } from "@shelf/shared";

export type LoanView = Loan & {
  overdue: boolean;
  lateFeeCents: number;
};

export type BookView = Omit<Book, "currentLoan"> & {
  currentLoan: LoanView | null;
};

export type MyLoanView = Omit<LoanView, "borrower"> & {
  book: { id: string; title: string };
  renewals: number;
};
