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

export type Book = {
  id: string;
  title: string;
  author: string;
  year: number;
  coverColor: string;
  available: boolean;
  currentLoan: Loan | null;
};

export const LOAN_DAYS = 14;
export const MAX_RENEWALS = 1;
