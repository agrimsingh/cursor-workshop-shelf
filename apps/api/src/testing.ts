import { openDb } from "@shelf/db";
import { buildApp } from "./app";

export const TEST_NOW = "2026-11-27T00:00:00.000Z";

type GqlResult<T> = { data?: T; errors?: { message: string; extensions?: { code?: string } }[] };

/** A fresh seeded in-memory API. Call `query` with an optional user id to act as that user. */
export function testApi(now = TEST_NOW) {
  const db = openDb(":memory:");
  const app = buildApp(db, () => now);

  async function query<T = Record<string, any>>(
    source: string,
    variables: Record<string, unknown> = {},
    userId?: string,
  ): Promise<GqlResult<T>> {
    const response = await app.fetch("http://shelf.test/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", ...(userId ? { "x-user-id": userId } : {}) },
      body: JSON.stringify({ query: source, variables }),
    });
    return (await response.json()) as GqlResult<T>;
  }

  return { db, query };
}
