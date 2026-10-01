type Props = {
  label: string;
  value: string | null | undefined;
};

const KeyValueRow = ({ label, value }: Props) => {
  const shown = value && value.trim().length ? value : "—";

  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground text-right wrap-break-word">{shown}</div>
    </div>
  );
};

export default KeyValueRow;