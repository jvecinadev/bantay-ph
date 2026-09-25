type StatCardProps = {
  label: string;
  value: React.ReactNode;
  sub?: string;
};

const StatCard = ({ label, value, sub }: StatCardProps) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {label}
      </div>
      <div className="mt-2 text-2xl font-bold tracking-tight text-text-primary">
        {value}
      </div>
      {sub ? <div className="mt-1 text-xs text-text-secondary">{sub}</div> : null}
    </div>
  );
};

export default StatCard;