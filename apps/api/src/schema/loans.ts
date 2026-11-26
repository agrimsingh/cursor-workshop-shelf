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
    renewals: Int!
  }

  type Query {
    "The signed-in user's loans, newest first. Empty when signed out."
    myLoans: [Loan!]!
  }

  type Mutation {
    borrowBook(bookId: ID!): Loan!
    returnBook(bookId: ID!): Loan!
    "Adds 14 days to the due date. Once per loan, and not when overdue."
    renewLoan(bookId: ID!): Loan!
  }
`;
