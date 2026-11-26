// Shared contract. Do not change without updating PARALLEL.md.
export const notificationsTypeDefs = /* GraphQL */ `
  type Notification {
    id: ID!
    book: Book!
    message: String!
    createdAt: String!
    read: Boolean!
  }

  type Query {
    "The signed-in user's notifications, newest first."
    myNotifications: [Notification!]!
  }

  type Mutation {
    "Errors with FORBIDDEN if the notification belongs to someone else."
    markNotificationRead(id: ID!): Notification!
  }
`;
