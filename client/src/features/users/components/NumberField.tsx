type Props = {
  label: string;
  value: number | null;
  onChange: (next: number | null) => void;
  disabled?: boolean;
  error?: string;
};

const NumberField = ({ label, value, onChange, disabled, error }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <label className="block">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <input
          type="number"
          className={[
            "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            disabled ? "opacity-50" : "",
          ].join(" ")}
          value={value ?? ""}
          disabled={disabled}
          onChange={(e) => {
            const raw = e.target.value;
            onChange(raw === "" ? null : Number(raw));
          }}
        />
      </label>

      {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
    </div>
  );
};

export default NumberField;