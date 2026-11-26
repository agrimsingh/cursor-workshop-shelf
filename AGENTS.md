# Shelf

A team lending library: TypeScript npm workspace with a GraphQL API, a React app, and SQLite.

## Commands

- `npm run dev`: API on :4000, web on :5173
- `npm run check`: type check and all tests. Run it before you say you're done.
- `npm run check:conventions`: the house rules below, checked statically
- `npm run db:reset`: re-seed after changing the schema or seed

## Layout

- `packages/db`: all SQL. One file per table. Schema changes go in `migrate.ts` with `addColumnIfMissing`.
- `apps/api`: GraphQL Yoga. Schema in `src/schema/<domain>.ts`, resolvers in `src/resolvers/<domain>.ts`.
- `apps/web`: React with Vite. One component per file in `src/components`. Queries use fragments from `src/api.ts`.
- `packages/shared`: types, constants, `formatDate`, `formatMoney`, `AppError`. Used by every package.

## House rules

- Show dates with `formatDate` and money with `formatMoney`. Never `toLocaleDateString`.
- Resolvers throw `AppError(code, message)`, never a plain `Error`. Codes: `NOT_FOUND`, `FORBIDDEN`, `CONFLICT`, `BAD_INPUT`, `UNAUTHENTICATED`.
- Resolvers never write SQL. Add a function to `packages/db` and call it.
- Every mutation calls `requireUser(ctx)` first. Queries for "my" data return an empty list when signed out.
- Business limits (loan length, renewals, fees) are constants in `packages/shared`. Don't hard-code them.
- Tests sit next to the code as `*.test.ts`. API tests use `testApi()` from `apps/api/src/testing.ts`.
