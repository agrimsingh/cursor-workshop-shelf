import type { Db } from "@shelf/db";
import { AppError } from "@shelf/shared";
import { createGraphQLError, createSchema, createYoga, maskError } from "graphql-yoga";
import type { Context } from "./context";
import { resolvers } from "./resolvers";
import { typeDefs } from "./schema";

export function buildApp(db: Db, now: () => string = () => new Date().toISOString()) {
  return createYoga({
    schema: createSchema({ typeDefs, resolvers }),
    context: ({ request }): Context => ({ db, now, userId: request.headers.get("x-user-id") }),
    maskedErrors: {
      maskError(error, message, isDev) {
        const original = (error as { originalError?: unknown }).originalError ?? error;
        if (original instanceof AppError) {
          return createGraphQLError(original.message, {
            path: (error as { path?: readonly (string | number)[] }).path,
            extensions: { code: original.code },
          });
        }
        return maskError(error, message, isDev);
      },
    },
  });
}
