import type { Db } from "@shelf/db";
import { AppError } from "@shelf/shared";

export type Context = {
  db: Db;
  /** The signed-in user, from the `x-user-id` header. The workshop has no real auth. */
  userId: string | null;
  now: () => string;
};

export function requireUser(ctx: Context): string {
  if (!ctx.userId) throw new AppError("UNAUTHENTICATED", "Pick a user first.");
  return ctx.userId;
}
