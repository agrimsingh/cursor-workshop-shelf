# Starter: plan, build, review, rewind

**Branch:** `main` · **Time:** 20–30 minutes · **Answer key:** `starter-done`

You'll add one feature that touches every layer of the app: the database, the GraphQL API, and the React UI.

## The task

Books wear out. Add a **condition** to every book (new, good, or worn), show it on each book card, and let people filter the list by condition.

## Steps

1. **Plan first.** Open a new agent and switch to **Plan mode** (Shift+Tab). Paste:

   > Add a condition to every book: new, good, or worn. Seed a mix of conditions. Show the condition on each book card, and add a filter next to the search box. Look at how search works today and follow the same path through the db package, the GraphQL API, and the web app.

2. **Edit the plan.** Read it before you build. Change at least one step. For example, ask for the filter to be a dropdown, or for worn books to get a warning colour.

3. **Build.** Click **Build** (or switch to Agent mode). Watch which files it reads and edits.

4. **Review the diff.** Open the changes. Reject one hunk you don't like and ask the agent to redo it your way.

5. **Rewind once.** Send a follow-up you don't want (for example, "also rename Book to Volume everywhere"). Then restore the checkpoint from before that message.

6. **Check your work.**

   ```bash
   npm run check:starter   # the acceptance check for this task
   npm run check           # type check and the existing tests
   ```

   Tip: tell the agent "make `npm run check:starter` pass". It can run the check and fix what fails.

7. **See it.** `npm run dev`, then open http://localhost:5173.

## Stretch

- Only the borrower should see a "Report damage" button that moves a book from good to worn.
- Ask the agent to write the tests for your stretch change first, then make them pass.

## Stuck?

```bash
git stash            # park your work
git checkout starter-done
```
