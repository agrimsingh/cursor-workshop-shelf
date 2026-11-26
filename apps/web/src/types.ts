import type { Book, Loan } from "@shelf/shared";

export type LoanView = Loan & {
  overdue: boolean;
  lateFeeCents: number;
};

export type BookView = Omit<Book, "currentLoan"> & {
  currentLoan: LoanView | null;
};
