import { formatDate } from "@shelf/shared";
import { useCallback, useEffect, useState } from "react";
import { gql } from "../api";
import type { NotificationView } from "../types";

// Part C owns this file. See PARALLEL.md.

export type NotificationBellProps = {
  meId: string | null;
};

const NOTIFICATIONS_QUERY = /* GraphQL */ `
  {
    myNotifications {
      id
      message
      createdAt
      read
      book {
        id
        title
      }
    }
  }
`;

const POLL_MS = 5000;

/** Sits in the header. Shows the unread count and a list of the signed-in user's notifications. */
export function NotificationBell({ meId }: NotificationBellProps) {
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [open, setOpen] = useState(false);

  const load = useCallback(async () => {
    if (!meId) return setNotifications([]);
    const data = await gql<{ myNotifications: NotificationView[] }>(NOTIFICATIONS_QUERY);
    setNotifications(data.myNotifications);
  }, [meId]);

  useEffect(() => {
    void load();
    const timer = setInterval(() => void load(), POLL_MS);
    return () => clearInterval(timer);
  }, [load]);

  if (!meId) return null;

  const unread = notifications.filter((n) => !n.read).length;

  const markRead = async (id: string) => {
    await gql(`mutation ($id: ID!) { markNotificationRead(id: $id) { id } }`, { id });
    await load();
  };

  return (
    <div className="bell">
      <button className="bell-button" onClick={() => setOpen(!open)} aria-label={`${unread} unread notifications`}>
        🔔{unread > 0 && <span className="bell-count">{unread}</span>}
      </button>
      {open && (
        <ul className="bell-list">
          {notifications.length === 0 && <li className="bell-empty">Nothing yet.</li>}
          {notifications.map((n) => (
            <li key={n.id} className={n.read ? "read" : "unread"}>
              <span>{n.message}</span>
              <small>{formatDate(n.createdAt)}</small>
              {!n.read && <button onClick={() => markRead(n.id)}>Mark read</button>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
