import { getUser, listUsers } from "@shelf/db";
import type { Context } from "../context";

export const usersResolvers = {
  Query: {
    me: (_: unknown, __: unknown, ctx: Context) => (ctx.userId ? (getUser(ctx.db, ctx.userId) ?? null) : null),
    users: (_: unknown, __: unknown, ctx: Context) => listUsers(ctx.db),
  },
};
