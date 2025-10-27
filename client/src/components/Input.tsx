export const Input = ({
  value,
  setValue,
  placeholder = "",
}: {
  value: string | null;
  setValue: (val: string) => void;
  placeholder?: string;
}) => {
  return (
    <input
      className="p-2 border rounded-xl bg-white"
      type="text"
      value={value || ""}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
    />
  );
};
