# Shelf

A team lending library: TypeScript npm workspace with a GraphQL API, a React app, and SQLite.

## Commands

- `npm run dev`: API on :4000, web on :5173
- `npm run check`: type check and all tests. Run it before you say you're done.
- `npm run check:<exercise>`: acceptance check for the current exercise (see `package.json`)

## Layout

- `packages/db`: all SQL. One file per table. Resolvers call these functions; they never write SQL.
- `apps/api`: GraphQL Yoga. Schema in `src/schema/<domain>.ts`, resolvers in `src/resolvers/<domain>.ts`.
- `apps/web`: React with Vite. One component per file in `src/components`.
- `packages/shared`: types, `formatDate`, `AppError`. Used by every package.

## Conventions

- Throw `AppError(code, message)` from `@shelf/shared` in resolvers. Never a plain `Error`.
- Show dates to people with `formatDate`. Never `toLocaleDateString`.
- Every mutation calls `requireUser(ctx)` first.
- Tests sit next to the code as `*.test.ts`. API tests use `testApi()` from `apps/api/src/testing.ts`.
