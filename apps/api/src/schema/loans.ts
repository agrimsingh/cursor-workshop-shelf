export const loansTypeDefs = /* GraphQL */ `
  type Loan {
    id: ID!
    book: Book!
    borrower: User!
    borrowedAt: String!
    dueAt: String!
    returnedAt: String
    overdue: Boolean!
    "Late fee in cents, as of now for active loans or as of the return for returned ones."
    lateFeeCents: Int!
  }

  type Mutation {
    borrowBook(bookId: ID!): Loan!
    returnBook(bookId: ID!): Loan!
  }
`;
