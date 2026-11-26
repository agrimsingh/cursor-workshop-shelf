# Review rules for Shelf

Flag these as bugs, with the file and line:

## Identity and access

- The signed-in user comes only from `ctx.userId` via `requireUser(ctx)`. A mutation that takes a user id as an argument, or reads one from input, lets anyone act as anyone. Treat that as a security bug.
- Every mutation must call `requireUser(ctx)` before it changes anything.
- A user can only change their own loans, reviews, and notifications. Check ownership and throw `AppError("FORBIDDEN", ...)`.

## Data

- All SQL lives in `packages/db` and uses `?` placeholders. Any SQL built with string interpolation or concatenation of user input is a SQL injection bug.
- Values with a fixed range (ratings are 1 to 5) must be validated in the resolver with `AppError("BAD_INPUT", ...)`.
- Averages and ratios must handle an empty set. Return `null`, never `NaN` or a division by zero.

## Errors and tests

- Resolvers throw `AppError`, never a plain `Error`.
- Every new error path needs a test that uses `testApi()`.

Don't comment on formatting or naming unless it hides a bug.
