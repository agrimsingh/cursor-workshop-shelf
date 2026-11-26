# Builder: teach the agent your house rules

**Branch:** `team-practice` · **Time:** 30–45 minutes · **Answer key:** `team-practice-done`

This repo has house rules, but nothing tells an agent about them. You'll watch an agent work without them, then write them down as an AGENTS.md, a project rule, and a skill, and watch the difference.

The house rules (`npm run check:conventions` checks the first three):

1. Dates shown to people go through `formatDate` from `@shelf/shared`.
2. Resolvers throw `AppError(code, message)`, never a plain `Error`.
3. All SQL lives in `packages/db`. Resolvers call db functions.
4. Every mutation calls `requireUser(ctx)` first.

## Part 1: AGENTS.md, rules, and skills

1. **Run without guidance.** Open a new agent in Agent mode and paste:

   > Add a "My loans" page. Add a `myLoans` query that returns the signed-in user's loans, newest first, and an empty list when signed out. Add a `renewLoan(bookId)` mutation that adds 14 days to the due date. A loan can be renewed once, and not when it's overdue. Track renewals on the loan and expose `renewals` on the Loan type. In the web app, add a `MyLoans` component in `apps/web/src/components/MyLoans.tsx` that takes `loans` and `onRenew`, shows each book title and its due date, and shows a Renew button only when the loan can be renewed. Add a "My loans" toggle in the header.

   Then run:

   ```bash
   npm run check:team-practice   # does the feature work?
   npm run check:conventions     # did it follow the house rules?
   ```

2. **Rewind.** Restore the checkpoint from before your prompt, so the feature is gone.

3. **Write AGENTS.md.** Ask a new agent:

   > Read this codebase and write an AGENTS.md at the root: how to run, test, and check it, the layout, and the house conventions. Under 30 lines.

   Read what it wrote. Add any house rule above that it missed. AGENTS.md is plain markdown, and every agent reads it every time.

4. **Add a scoped rule.** Ask for a project rule that only loads for API files:

   > Create a project rule in `.cursor/rules/api.mdc` that applies to `apps/api/**`. It should cover AppError codes, requireUser in every mutation, and calling packages/db instead of writing SQL.

5. **Make a skill.** Type `/create-skill` and describe the workflow you just watched: adding a field end to end (db function, GraphQL schema, resolver, test, web fragment, component). Save it as a project skill so it ships with the repo.

6. **Run it again.** New agent, same prompt as step 1. Compare: did it follow the rules this time? Did it use the skill?

   ```bash
   npm run check:team-practice
   npm run check:conventions
   npm run check
   ```

## Part 2: context (10 minutes)

A bug report from Linus:

> Shelf shows a **$6.00** late fee on The Mythical Man-Month. It was due 15 Nov at 9:00 UTC, and fees are 50c per *full* day late. At 00:00 UTC on 27 Nov that's 11 full days, so it should be **$5.50**.

1. **Broad.** In a new agent: "Linus's late fee is wrong. Fix it." Watch how many files it reads before it finds the cause.
2. **Targeted.** Rewind, then in a new agent: "@fees.ts rounds partial days up, but fees count full days only. Fix it and run `npm run check:context`." Compare the number of steps.
3. Notice the existing tests in `fees.test.ts` pass with the bug. Ask the agent to add the missing test case.

## Stretch

- **Hook:** add a `stop` hook in `.cursor/hooks.json` that runs `npm run check:conventions` when the agent finishes and sends any problems back as a follow-up.
- **Nested AGENTS.md:** add `apps/web/AGENTS.md` with front-end-only rules and check that agents working in `apps/web` pick it up.

## Stuck?

```bash
git stash
git checkout team-practice-done
npm run db:reset
```
