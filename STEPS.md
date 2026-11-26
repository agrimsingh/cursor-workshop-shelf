# Ship safely: Bugbot and merge gates

**Branches:** `ship-safely` (base), `ship-safely-pr` (the pull request) · **Time:** 10–15 minutes · **Answer key:** `ship-safely-done`

The open pull request **"Add book reviews"** merges `ship-safely-pr` into `ship-safely`. Its tests pass. It still has bugs that break the rules in `.cursor/BUGBOT.md`.

## Watch (facilitator demo)

1. Open the pull request on GitHub and read `.cursor/BUGBOT.md`. These are the team's own review rules, kept in the repo.
2. Read Bugbot's comments on the pull request. For each one, ask: would our current review have caught it?
3. Use **Fix in Cursor** on one comment and watch the agent fix it.
4. Talk through where Bugbot sits among your gates: required checks, Bugbot as a required check, then a human approval.

## Try it yourself (local)

You can't push to this repo, but you can review the same change in your editor.

```bash
git checkout ship-safely-pr
npm install && npm run db:reset
npm run check               # passes: the tests don't cover the bugs
npm run check:ship-safely   # fails: the acceptance check does
```

1. In a new agent, paste:

   > Review @Branch against `.cursor/BUGBOT.md`. List each bug with the file, the line, and why it matters. Don't fix anything yet.

2. Compare its list with Bugbot's comments on the pull request.
3. Ask it to fix the bugs and add a test for each, then run `npm run check:ship-safely`.

## Stretch

- Add a rule to `.cursor/BUGBOT.md` that your team would want, then ask the agent to review again.
- Write a `BUGBOT.md` inside `apps/web` with front-end-only rules.

## Stuck?

```bash
git stash
git checkout ship-safely-done
git diff ship-safely-pr ship-safely-done   # the fixes
```
