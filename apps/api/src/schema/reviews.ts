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
    "Null when the book has no reviews."
    averageRating: Float
  }

  type Query {
    searchReviews(text: String!): [Review!]!
  }

  type Mutation {
    "Reviews as the signed-in user. Rating must be 1 to 5."
    addReview(bookId: ID!, rating: Int!, body: String!): Review!
  }
`;
