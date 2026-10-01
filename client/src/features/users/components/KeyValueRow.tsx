type Props = { label: string; value?: string | null };

const KeyValueRow = ({ label, value }: Props) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="text-sm text-foreground text-right break-words">
        {value && value.trim().length ? value : "—"}
      </div>
    </div>
  );
};

export default KeyValueRow;