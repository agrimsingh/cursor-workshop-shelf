import { MAX_RENEWALS, formatDate, formatMoney } from "@shelf/shared";
import type { MyLoanView } from "../types";

type Props = {
  loans: MyLoanView[];
  onRenew: (bookId: string) => void;
};

const canRenew = (loan: MyLoanView) => !loan.returnedAt && !loan.overdue && loan.renewals < MAX_RENEWALS;

export function MyLoans({ loans, onRenew }: Props) {
  if (loans.length === 0) return <p className="empty">You have no loans yet.</p>;

  return (
    <ul className="loans">
      {loans.map((loan) => (
        <li key={loan.id} className="loan">
          <div>
            <strong>{loan.book.title}</strong>
            <p className="meta">
              {loan.returnedAt
                ? `Returned ${formatDate(loan.returnedAt)}`
                : `${loan.overdue ? "Overdue, was due" : "Due"} ${formatDate(loan.dueAt)}`}
              {loan.lateFeeCents > 0 && ` · ${formatMoney(loan.lateFeeCents)} late fee`}
              {loan.renewals > 0 && " · renewed"}
            </p>
          </div>
          {canRenew(loan) && <button onClick={() => onRenew(loan.book.id)}>Renew</button>}
        </li>
      ))}
    </ul>
  );
}
