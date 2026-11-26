import { booksResolvers } from "./books";
import { loansResolvers } from "./loans";
import { notificationsResolvers } from "./notifications";
import { usersResolvers } from "./users";
import { waitlistResolvers } from "./waitlist";

export const resolvers = [booksResolvers, loansResolvers, usersResolvers, waitlistResolvers, notificationsResolvers];
