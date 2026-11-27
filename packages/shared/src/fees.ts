import { daysBetween } from "./dates";

export const FEE_CENTS_PER_DAY = 50;
export const MAX_FEE_CENTS = 1000;

/** Late fee for a loan: 50c for each full day past the due time, capped at $10. */
export function lateFeeCents(dueAt: string, asOf: string): number {
  const daysLate = daysBetween(dueAt, asOf);
  if (daysLate <= 0) return 0;
  return Math.min(daysLate * FEE_CENTS_PER_DAY, MAX_FEE_CENTS);
}

export function formatMoney(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}
