import type { ReactNode } from "react";

type MenuRowProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  trailing?: ReactNode;
  tone?: "default" | "danger";
  onClick: () => void;
  disabled?: boolean;
};

const MenuRow = ({
  icon,
  label,
  description,
  trailing,
  tone = "default",
  onClick,
  disabled,
}: MenuRowProps) => {
  const isDanger = tone === "danger";

  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      disabled={disabled}
      className={[
        "flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left transition-colors focus:outline-none disabled:cursor-not-allowed disabled:opacity-60",
        isDanger
          ? "hover:bg-danger-light focus-visible:bg-danger-light"
          : "hover:bg-surface-sunken focus-visible:bg-surface-sunken",
      ].join(" ")}
    >
      <span className="flex min-w-0 items-center gap-3">
        <span
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
            isDanger
              ? "bg-danger-light text-danger"
              : "bg-surface-sunken text-text-secondary",
          ].join(" ")}
        >
          {icon}
        </span>
        <span className="min-w-0">
          <span
            className={[
              "block truncate text-sm font-medium",
              isDanger ? "text-danger" : "text-text-primary",
            ].join(" ")}
          >
            {label}
          </span>
          {description ? (
            <span className="block truncate text-xs text-text-secondary">
              {description}
            </span>
          ) : null}
        </span>
      </span>
      {trailing}
    </button>
  );
};

export default MenuRow;