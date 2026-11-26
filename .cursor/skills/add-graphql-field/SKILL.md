---
name: add-graphql-field
description: Add a field, query, or mutation end to end in Shelf, from the database to the React UI. Use when a change needs new data in the API and on screen.
---

# Add a GraphQL field end to end

Work from the bottom up, and run checks after each layer.

1. **Database** (`packages/db`)
   - New column: add `addColumnIfMissing(...)` in `migrate.ts`, and update `seed.ts` if the seed needs values.
   - Add or extend a function in the table's file (`books.ts`, `loans.ts`, ...). Alias snake_case columns to camelCase in `COLUMNS`.
2. **Shared** (`packages/shared`): add types, constants, and display helpers that both sides need.
3. **Schema** (`apps/api/src/schema/<domain>.ts`): add the field, query, or mutation. Describe errors in a doc string.
4. **Resolver** (`apps/api/src/resolvers/<domain>.ts`): follow `.cursor/rules/api.mdc`.
5. **API tests**: add cases next to the resolver with `testApi()`. Cover the happy path and each error code.
6. **Web**
   - Add the field to the fragment or query in `apps/web/src/api.ts` or the component.
   - Extend the view type in `apps/web/src/types.ts`.
   - Render it in a component, using `formatDate` and `formatMoney` for display.
7. **Verify**

   ```bash
   npm run check
   npm run check:conventions
   ```

   If the schema or seed changed, run `npm run db:reset` before `npm run dev`.
