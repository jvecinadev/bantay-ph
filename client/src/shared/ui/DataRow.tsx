type Props = {
  label: string;
  value: string | number | null | undefined;
  mono?: boolean;
};

const DataRow = ({ label, value, mono }: Props) => {
  const isEmpty = value === null || value === undefined || value === "";

  return (
    <div className="grid grid-cols-[140px_1fr] items-baseline gap-x-6 py-2.5">
      <dt className="text-xs text-text-secondary">{label}</dt>
      <dd
        className={[
          "min-w-0 wrap-break-word text-sm text-text-primary",
          mono && !isEmpty ? "font-mono text-[13px]" : "",
        ].join(" ")}
      >
        {isEmpty ? <span className="text-text-secondary/50">—</span> : value}
      </dd>
    </div>
  );
};

export default DataRow;