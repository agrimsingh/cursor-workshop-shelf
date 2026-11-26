import type { Book, Loan, User } from "@shelf/shared";

export type WaitlistEntryView = {
  position: number;
  user: User;
  joinedAt: string;
};

export type BookView = Omit<Book, "currentLoan"> & {
  currentLoan: (Loan & { overdue: boolean }) | null;
  waitlist: WaitlistEntryView[];
  myWaitlistPosition: number | null;
};

export type NotificationView = {
  id: string;
  message: string;
  createdAt: string;
  read: boolean;
  book: { id: string; title: string };
};
