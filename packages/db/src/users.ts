import type { DatabaseSync } from "node:sqlite";

export type UserRow = { id: string; name: string; email: string };

export function listUsers(db: DatabaseSync): UserRow[] {
  return db.prepare("SELECT id, name, email FROM users ORDER BY name").all() as UserRow[];
}

export function getUser(db: DatabaseSync, id: string): UserRow | undefined {
  return db.prepare("SELECT id, name, email FROM users WHERE id = ?").get(id) as UserRow | undefined;
}
