import { booksResolvers } from "./books";
import { loansResolvers } from "./loans";
import { usersResolvers } from "./users";

export const resolvers = [booksResolvers, loansResolvers, usersResolvers];
