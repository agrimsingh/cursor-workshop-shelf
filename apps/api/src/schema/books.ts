export const booksTypeDefs = /* GraphQL */ `
  enum BookCondition {
    NEW
    GOOD
    WORN
  }

  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
    coverColor: String!
    condition: BookCondition!
    available: Boolean!
    currentLoan: Loan
  }

  type Query {
    books(search: String, condition: BookCondition): [Book!]!
    book(id: ID!): Book
  }
`;
