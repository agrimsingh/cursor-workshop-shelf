export type AppErrorCode = "NOT_FOUND" | "FORBIDDEN" | "CONFLICT" | "BAD_INPUT" | "UNAUTHENTICATED";

/** The only error type the API throws. The server turns it into a GraphQL error with `extensions.code`. */
export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
