export const booksTypeDefs = /* GraphQL */ `
  type Book {
    id: ID!
    title: String!
    author: String!
    year: Int!
    coverColor: String!
    available: Boolean!
    currentLoan: Loan
  }

  type Query {
    books(search: String): [Book!]!
    book(id: ID!): Book
  }
`;
