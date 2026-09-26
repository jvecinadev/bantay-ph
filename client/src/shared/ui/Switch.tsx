const Switch = ({ checked }: { checked: boolean }) => (
  <span
    className={[
      "relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors duration-200",
      checked ? "bg-primary" : "bg-border-strong",
    ].join(" ")}
  >
    <span
      className={[
        "inline-block h-4 w-4 rounded-full bg-surface shadow-sm transition-transform duration-200",
        checked ? "translate-x-4.5" : "translate-x-0.5",
      ].join(" ")}
    />
  </span>
);

export default Switch;