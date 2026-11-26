# Plan: book waitlist

When a book is on loan, people can join a waitlist. When the book comes back, the next person in line gets a notification.

This plan is written so three agents can build it at the same time. The contract below is already in the code. **Don't change the contract.** If a part needs it changed, stop and say so.

## Contract (already in the repo)

| What | Where |
| --- | --- |
| Tables `waitlist` and `notifications` | `packages/db/src/migrate.ts` |
| DB function signatures (stubs that throw) | `packages/db/src/waitlist.ts`, `packages/db/src/notifications.ts` |
| GraphQL schema | `apps/api/src/schema/waitlist.ts`, `apps/api/src/schema/notifications.ts` |
| `notifyNextInLine(ctx, bookId)`, already called by `returnBook` | `apps/api/src/notify.ts` |
| Front-end types `BookView.waitlist`, `BookView.myWaitlistPosition`, `NotificationView` | `apps/web/src/types.ts` |
| Component slots, already mounted where they belong | `WaitlistButton` (Part B), `NotificationBell` (Part C, in the header) |

## Parts

Each part edits **only** the files it owns. That's what lets them run in parallel without conflicts.

### Part A: waitlist data and API

Owns: `packages/db/src/waitlist.ts`, `apps/api/src/resolvers/waitlist.ts`, new tests next to them.

- Implement the three DB functions. Position is 1-based: earliest `joinedAt` first, then lowest `id`.
- Implement `Book.waitlist`, `Book.myWaitlistPosition`, `joinWaitlist`, and `leaveWaitlist`.
- `joinWaitlist` needs a signed-in user. It errors with `CONFLICT` when the book is available (borrow it instead), when you are the borrower, or when you are already waiting. Unknown book: `NOT_FOUND`.

### Part B: waitlist UI

Owns: `apps/web/src/components/WaitlistButton.tsx`, `BookCard.tsx`, `BookGrid.tsx`, `App.tsx`, `api.ts`, `styles.css`.

- Add `waitlist { position joinedAt user { id name } }` and `myWaitlistPosition` to `BOOK_FIELDS` in `api.ts`.
- `WaitlistButton`: when the book is on loan to someone else, show "Join waitlist" and how many people are waiting ("2 waiting"). When you're in line, show your place ("You're #2") and a "Leave" button. Show nothing if no user is picked.
- Render `WaitlistButton` in `BookCard` and wire `onJoin` / `onLeave` through `BookGrid` to the mutations in `App.tsx`.

### Part C: notifications

Owns: `packages/db/src/notifications.ts`, `apps/api/src/resolvers/notifications.ts`, `apps/api/src/notify.ts`, `apps/web/src/components/NotificationBell.tsx`.

- Implement the four DB functions.
- `notifyNextInLine`: find the first person on the book's waitlist (use `waitlistForBook` from Part A), create a notification like "Refactoring is back. You're next in line.", and remove them from the waitlist. Do nothing when nobody is waiting.
- Implement `myNotifications` (empty list when signed out) and `markNotificationRead` (`FORBIDDEN` for someone else's notification).
- `NotificationBell`: fetch `myNotifications` for the current user, show the unread count, and list notifications with a way to mark one read.

## Done when

```bash
npm run check:parallel   # acceptance check for all three parts
npm run check            # type check and every existing test
```

Then the `reviewer` subagent reviews the combined diff against this plan.
