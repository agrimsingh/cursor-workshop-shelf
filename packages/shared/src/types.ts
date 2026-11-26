export type User = {
  id: string;
  name: string;
};

export type Loan = {
  id: string;
  borrower: User;
  borrowedAt: string;
  dueAt: string;
  returnedAt: string | null;
};

export type BookCondition = "NEW" | "GOOD" | "WORN";

export const CONDITION_LABELS: Record<BookCondition, string> = {
  NEW: "New",
  GOOD: "Good",
  WORN: "Worn",
};

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  coverColor: string;
  condition: BookCondition;
  available: boolean;
  currentLoan: Loan | null;
};

export const LOAN_DAYS = 14;
