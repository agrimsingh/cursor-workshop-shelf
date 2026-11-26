import { getBook, getUser, insertReview, ratingTotals, reviewsForBook, searchReviews, type BookRow, type ReviewRow } from "@shelf/db";
import { AppError } from "@shelf/shared";
import { requireUser, type Context } from "../context";

const MIN_RATING = 1;
const MAX_RATING = 5;

export const reviewsResolvers = {
  Query: {
    searchReviews: (_: unknown, args: { text: string }, ctx: Context) => searchReviews(ctx.db, args.text),
  },
  Mutation: {
    addReview: (_: unknown, args: { bookId: string; rating: number; body: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const bookId = Number(args.bookId);
      if (!getBook(ctx.db, bookId)) throw new AppError("NOT_FOUND", "That book does not exist.");
      if (!Number.isInteger(args.rating) || args.rating < MIN_RATING || args.rating > MAX_RATING) {
        throw new AppError("BAD_INPUT", `Ratings go from ${MIN_RATING} to ${MAX_RATING}.`);
      }

      return insertReview(ctx.db, { bookId, userId, rating: args.rating, body: args.body, createdAt: ctx.now() });
    },
  },
  Book: {
    reviews: (book: BookRow, _: unknown, ctx: Context) => reviewsForBook(ctx.db, book.id),
    averageRating: (book: BookRow, _: unknown, ctx: Context) => {
      const { total, count } = ratingTotals(ctx.db, book.id);
      return count === 0 ? null : Math.round((total / count) * 10) / 10;
    },
  },
  Review: {
    author: (review: ReviewRow, _: unknown, ctx: Context) => getUser(ctx.db, review.userId),
  },
};
