// Part A owns this file. See PARALLEL.md.

const notImplemented = (name: string) => () => {
  throw new Error(`Not implemented yet (Part A): ${name}`);
};

export const waitlistResolvers = {
  Book: {
    waitlist: notImplemented("Book.waitlist"),
    myWaitlistPosition: notImplemented("Book.myWaitlistPosition"),
  },
  Mutation: {
    joinWaitlist: notImplemented("joinWaitlist"),
    leaveWaitlist: notImplemented("leaveWaitlist"),
  },
};
