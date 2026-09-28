import type { Theme } from "../types";

type Props = {
  value: Theme;
  onChange: (next: Theme) => void;
  disabled?: boolean;
  error?: string;
};

const ThemeField = ({ value, onChange, disabled, error }: Props) => {
  const options: Theme[] = ["system", "light", "dark"];

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
          onChange={(e) => onChange(e.target.value as Theme)}
        >
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt === "system" ? "System" : opt === "light" ? "Light" : "Dark"}
            </option>
          ))}
        </select>
      </label>

      {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
    </div>
  );
};

export default ThemeField;