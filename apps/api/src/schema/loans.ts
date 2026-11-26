export const loansTypeDefs = /* GraphQL */ `
  type Loan {
    id: ID!
    book: Book!
    borrower: User!
    borrowedAt: String!
    dueAt: String!
    returnedAt: String
    overdue: Boolean!
  }

  type Mutation {
    borrowBook(bookId: ID!): Loan!
    returnBook(bookId: ID!): Loan!
  }
`;
