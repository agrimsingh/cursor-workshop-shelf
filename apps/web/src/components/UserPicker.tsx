import type { User } from "@shelf/shared";

type Props = {
  users: User[];
  meId: string | null;
  onChange: (id: string) => void;
};

export function UserPicker({ users, meId, onChange }: Props) {
  return (
    <label className="user-picker">
      Signed in as{" "}
      <select value={meId ?? ""} onChange={(e) => onChange(e.target.value)}>
        <option value="" disabled>
          Pick a user
        </option>
        {users.map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
      </select>
    </label>
  );
}
