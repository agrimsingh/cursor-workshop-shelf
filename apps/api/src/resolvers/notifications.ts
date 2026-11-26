import { getBook, getNotification, markNotificationRead, notificationsForUser, type NotificationRow } from "@shelf/db";
import { AppError } from "@shelf/shared";
import { requireUser, type Context } from "../context";

// Part C owns this file. See PARALLEL.md.

export const notificationsResolvers = {
  Query: {
    myNotifications: (_: unknown, __: unknown, ctx: Context) =>
      ctx.userId ? notificationsForUser(ctx.db, ctx.userId) : [],
  },
  Mutation: {
    markNotificationRead: (_: unknown, args: { id: string }, ctx: Context) => {
      const userId = requireUser(ctx);
      const notification = getNotification(ctx.db, Number(args.id));
      if (!notification) throw new AppError("NOT_FOUND", "That notification does not exist.");
      if (notification.userId !== userId) throw new AppError("FORBIDDEN", "That notification is not yours.");
      return markNotificationRead(ctx.db, notification.id, ctx.now());
    },
  },
  Notification: {
    book: (row: NotificationRow, _: unknown, ctx: Context) => getBook(ctx.db, row.bookId),
    read: (row: NotificationRow) => row.readAt !== null,
  },
};
