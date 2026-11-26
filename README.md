# Shelf: a Cursor workshop app

Shelf is a small team lending library. People borrow books, return them, and see who has what. It exists so you can practise working with Cursor agents on a codebase shaped like a real product: a TypeScript workspace with a React front end, a GraphQL API, and a database.

Every exercise lives on its own branch. Each branch starts from `main`, so you can do them in any order. Each branch also has a `-done` version that you can check out to catch up, or use to compare your work with.

## Set up (5 minutes, do this before the session)

You need Node 22.13 or later and git.

```bash
git clone https://github.com/agrimsingh/cursor-workshop-shelf.git
cd cursor-workshop-shelf
npm install
npm run doctor   # checks Node, dependencies, and ports
npm run dev      # API on :4000, web app on http://localhost:5173
```

Pick a user in the top-right corner to borrow and return books. There is no real sign-in.

No local setup? Start a cloud agent on this repo from [cursor.com/agents](https://cursor.com/agents) and do the Starter exercise from your browser.

## Exercises

| Level | Branch | What you practise | Answer key |
| --- | --- | --- | --- |
| Starter | `main` | Plan mode, Agent mode, reviewing a diff, rewinding to a checkpoint | `starter-done` |
| Builder | `team-practice` | AGENTS.md, project rules, skills, and targeted context with @ mentions | `team-practice-done` |
| Power | `parallel` | Splitting one feature across parallel agents with worktrees, `/multitask`, and a reviewer subagent | `parallel-done` |
| Demo | `ship-safely` | Bugbot reviewing a pull request against `.cursor/BUGBOT.md` | `ship-safely-done` |

Start an exercise:

```bash
git checkout <branch>
npm install
```

Then open `STEPS.md` on that branch. Each one has the goal, a prompt to start with, a check command that tells you when you're done, and a stretch goal.

Catch up or compare:

```bash
git stash
git checkout <branch>-done
git diff <branch> <branch>-done   # see what "done" looks like
```

## Layout

```
apps/api        GraphQL API (GraphQL Yoga). Schema in src/schema, resolvers in src/resolvers
apps/web        React app (Vite). Components in src/components
packages/db     SQLite access (node:sqlite). One file per table, plus migrate and seed
packages/shared Types, date helpers, and AppError, used by every package
checks          Acceptance checks for each exercise (npm run check:<exercise>)
```

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the API and the web app |
| `npm run check` | Type check and run the tests |
| `npm run check:<exercise>` | Run the acceptance check for an exercise |
| `npm run db:reset` | Delete the local database. It is re-created and re-seeded on the next start |
| `npm run doctor` | Check your setup |
