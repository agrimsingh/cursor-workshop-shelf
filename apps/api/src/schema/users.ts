export const usersTypeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
  }

  type Query {
    me: User
    users: [User!]!
  }
`;
