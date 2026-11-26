import { getBook, getUser, insertReview, ratingTotals, reviewsForBook, searchReviews, type BookRow, type ReviewRow } from "@shelf/db";
import { AppError } from "@shelf/shared";
import type { Context } from "../context";

export const reviewsResolvers = {
  Query: {
    searchReviews: (_: unknown, args: { text: string }, ctx: Context) => searchReviews(ctx.db, args.text),
  },
  Mutation: {
    addReview: (
      _: unknown,
      args: { bookId: string; rating: number; body: string; authorId: string },
      ctx: Context,
    ) => {
      const bookId = Number(args.bookId);
      if (!getBook(ctx.db, bookId)) throw new AppError("NOT_FOUND", "That book does not exist.");

      return insertReview(ctx.db, {
        bookId,
        userId: args.authorId,
        rating: args.rating,
        body: args.body,
        createdAt: ctx.now(),
      });
    },
  },
  Book: {
    reviews: (book: BookRow, _: unknown, ctx: Context) => reviewsForBook(ctx.db, book.id),
    averageRating: (book: BookRow, _: unknown, ctx: Context) => {
      const { total, count } = ratingTotals(ctx.db, book.id);
      return Math.round((total / count) * 10) / 10;
    },
  },
  Review: {
    author: (review: ReviewRow, _: unknown, ctx: Context) => getUser(ctx.db, review.userId),
  },
};
