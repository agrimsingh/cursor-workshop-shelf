import { booksResolvers } from "./books";
import { loansResolvers } from "./loans";
import { reviewsResolvers } from "./reviews";
import { usersResolvers } from "./users";

export const resolvers = [booksResolvers, loansResolvers, usersResolvers, reviewsResolvers];
