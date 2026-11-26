import type { Book, Loan } from "@shelf/shared";

export type BookView = Omit<Book, "currentLoan"> & {
  currentLoan: (Loan & { overdue: boolean }) | null;
};
