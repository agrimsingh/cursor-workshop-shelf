export const reviewsTypeDefs = /* GraphQL */ `
  type Review {
    id: ID!
    rating: Int!
    body: String!
    author: User!
    createdAt: String!
  }

  type Book {
    reviews: [Review!]!
    averageRating: Float!
  }

  type Query {
    searchReviews(text: String!): [Review!]!
  }

  type Mutation {
    "authorId lets the import script add reviews on behalf of people."
    addReview(bookId: ID!, rating: Int!, body: String!, authorId: ID!): Review!
  }
`;
