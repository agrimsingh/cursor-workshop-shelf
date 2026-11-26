const USER_KEY = "shelf.userId";

export function getCurrentUserId(): string | null {
  return localStorage.getItem(USER_KEY);
}

export function setCurrentUserId(id: string): void {
  localStorage.setItem(USER_KEY, id);
}

/** Sends a GraphQL request as the current user. Throws the first error message. */
export async function gql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const userId = getCurrentUserId();
  const response = await fetch("/graphql", {
    method: "POST",
    headers: { "content-type": "application/json", ...(userId ? { "x-user-id": userId } : {}) },
    body: JSON.stringify({ query, variables }),
  });
  const body = (await response.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) throw new Error(body.errors[0]!.message);
  return body.data as T;
}

export const BOOK_FIELDS = /* GraphQL */ `
  fragment BookFields on Book {
    id
    title
    author
    year
    coverColor
    available
    currentLoan {
      id
      dueAt
      overdue
      borrowedAt
      returnedAt
      borrower {
        id
        name
      }
    }
    waitlist {
      position
      joinedAt
      user {
        id
        name
      }
    }
    myWaitlistPosition
  }
`;
