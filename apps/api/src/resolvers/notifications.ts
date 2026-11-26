// Part C owns this file. See PARALLEL.md.

const notImplemented = (name: string) => () => {
  throw new Error(`Not implemented yet (Part C): ${name}`);
};

export const notificationsResolvers = {
  Query: {
    myNotifications: notImplemented("myNotifications"),
  },
  Mutation: {
    markNotificationRead: notImplemented("markNotificationRead"),
  },
};
