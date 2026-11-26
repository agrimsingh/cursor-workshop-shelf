import { CONDITION_LABELS, type BookCondition } from "@shelf/shared";

type Props = {
  value: BookCondition | null;
  onChange: (value: BookCondition | null) => void;
};

export function ConditionFilter({ value, onChange }: Props) {
  return (
    <select
      aria-label="Filter by condition"
      value={value ?? ""}
      onChange={(e) => onChange((e.target.value || null) as BookCondition | null)}
    >
      <option value="">Any condition</option>
      {(Object.keys(CONDITION_LABELS) as BookCondition[]).map((condition) => (
        <option key={condition} value={condition}>
          {CONDITION_LABELS[condition]}
        </option>
      ))}
    </select>
  );
}
