const DAY_MS = 24 * 60 * 60 * 1000;

const formatter = new Intl.DateTimeFormat("en-AU", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

/** Formats an ISO timestamp as "27 Nov 2026". Always use this for dates shown to people. */
export function formatDate(iso: string): string {
  return formatter.format(new Date(iso));
}

export function addDays(iso: string, days: number): string {
  return new Date(new Date(iso).getTime() + days * DAY_MS).toISOString();
}

/** Whole days from `fromIso` to `toIso`, rounded down. Negative when `toIso` is earlier. */
export function daysBetween(fromIso: string, toIso: string): number {
  return Math.floor((new Date(toIso).getTime() - new Date(fromIso).getTime()) / DAY_MS);
}
