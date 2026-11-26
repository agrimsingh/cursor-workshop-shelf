type Props = {
  value: string;
  onChange: (value: string) => void;
};

export function SearchBar({ value, onChange }: Props) {
  return (
    <input
      className="search"
      type="search"
      placeholder="Search by title or author"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  );
}
