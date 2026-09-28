type Props<TTheme extends string> = {
  value: TTheme;
  onChange: (next: TTheme) => void;
  disabled?: boolean;
  error?: string;
};

const ThemeField = <TTheme extends string,>({ value, onChange, disabled, error }: Props<TTheme>) => {
  // adjust labels/values if your backend uses different strings
  const options = ["SYSTEM", "LIGHT", "DARK"] as const;

  return (
    <div>
      <label className="block">
        <div className="text-sm font-medium text-foreground">Theme</div>
        <select
          className={[
            "mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground",
            "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background",
            disabled ? "opacity-50" : "",
          ].join(" ")}
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(e.target.value as TTheme)}
        >
          {/* keep current value even if it's not in our list */}
          {!options.includes(value as any) ? <option value={value}>{value}</option> : null}

          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "SYSTEM" ? "System" : opt === "LIGHT" ? "Light" : "Dark"}
            </option>
          ))}
        </select>
      </label>

      {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
    </div>
  );
};

export default ThemeField;