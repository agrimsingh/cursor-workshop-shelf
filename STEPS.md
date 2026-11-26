# Power: one feature, three agents in parallel

**Branch:** `parallel` · **Time:** 30–45 minutes · **Answer key:** `parallel-done`

You'll split one feature across three agents that run at the same time, merge their work, and have a reviewer subagent check it before you do.

## The task

Add a **waitlist**. When a book is on loan, people can join a queue. When it comes back, the next person in line gets a notification.

The plan is already written in `PARALLEL.md`, with the shared contract (schema, DB signatures, front-end types) in the code. Read it first. The contract is what lets three agents work at once without stepping on each other.

## Steps

1. **Read the plan.** Open `PARALLEL.md`. Note which files each part owns.

2. **See it fail.** `npm run check:parallel` fails across Parts A, B, and C. That's your finish line.

3. **Launch in parallel.** In a new agent, paste:

   > /multitask Build the waitlist in @PARALLEL.md. Run Part A, Part B, and Part C as separate subagents, each in its own worktree. Each part edits only the files it owns and must not change the contract. When all three finish, merge them into this branch, run `npm run check:parallel` and `npm run check`, and fix anything that fails.

   Watch the coordinator split the work. Open each subagent to see what it's doing.

   **No /multitask?** Open three agents yourself, set each to run in a worktree, and give each one: "Build Part A from @PARALLEL.md. Only edit the files Part A owns." (then B, then C). Apply each result when it finishes.

4. **Review in tiers.** When the checks pass, paste:

   > Use the reviewer subagent to review this branch against @PARALLEL.md.

   The reviewer is defined in `.cursor/agents/reviewer.md`. Read it: it's a role your whole team gets because it lives in the repo.

5. **You judge.** Read what the reviewer flagged. Decide what to fix and what ships.

6. **See it.** `npm run db:reset && npm run dev`. Sign in as Ada, join the waitlist for a book Grace has. Switch to Grace and return it. Switch back to Ada and check the bell.

## Stretch

- **Best of n:** run Part B twice on two different models and keep the better UI.
- **Make it your own reviewer:** edit `.cursor/agents/reviewer.md` with a check your team cares about, then run it again.
- **Hold the book:** after a return, reserve the book for the notified person for 48 hours. Write the contract change into `PARALLEL.md` first.

## Stuck?

```bash
git stash
git checkout parallel-done
npm run db:reset
```
