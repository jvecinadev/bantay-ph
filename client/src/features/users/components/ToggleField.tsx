type Props = {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (next: boolean) => void;
  disabled?: boolean;
  error?: string;
};

const ToggleField = ({ label, description, checked, onChange, disabled, error }: Props) => {
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-sm font-medium text-foreground">{label}</div>
          {description ? (
            <div className="mt-1 text-xs text-muted-foreground">{description}</div>
          ) : null}
        </div>

        <label className="relative inline-flex items-center">
          <input
            type="checkbox"
            className="peer sr-only"
            checked={checked}
            disabled={disabled}
            onChange={(e) => onChange(e.target.checked)}
          />
          <span
            className={[
              "h-6 w-11 rounded-full border border-border bg-muted transition",
              "peer-focus-visible:outline-none peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background",
              "peer-checked:bg-primary peer-disabled:opacity-50",
            ].join(" ")}
          />
          <span
            className={[
              "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-background transition-transform",
              "peer-checked:translate-x-5",
            ].join(" ")}
          />
        </label>
      </div>

      {error ? <div className="mt-2 text-xs text-destructive">{error}</div> : null}
    </div>
  );
};

export default ToggleField;