// Shared contract. Do not change without updating PARALLEL.md.
export const waitlistTypeDefs = /* GraphQL */ `
  type WaitlistEntry {
    position: Int!
    user: User!
    joinedAt: String!
  }

  type Book {
    "Everyone waiting for this book, next in line first."
    waitlist: [WaitlistEntry!]!
    "The signed-in user's place in line, or null."
    myWaitlistPosition: Int
  }

  type Mutation {
    "Join the waitlist for a book that is on loan. Errors with CONFLICT if the book is available, you have it, or you are already waiting."
    joinWaitlist(bookId: ID!): WaitlistEntry!
    "Leave the waitlist. Returns false if you were not on it."
    leaveWaitlist(bookId: ID!): Boolean!
  }
`;
