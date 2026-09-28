type Props = {
  label: string;
  value: string;
  onChange: (next: string) => void;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
};

const TextField = ({ label, value, onChange, placeholder, disabled, error }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <label className="block">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <input
          className={[
            "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            disabled ? "opacity-50" : "",
          ].join(" ")}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value)}
        />
      </label>

      {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
    </div>
  );
};

export default TextField;