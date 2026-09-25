type Props = {
  title: string;
  data: Record<string, number> | undefined;
};

const KeyValueBarsCard = ({ title, data }: Props) => {
  const entries = Object.entries(data ?? {})
    .map(([k, v]) => [k, Number(v ?? 0)] as const)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const max = entries[0]?.[1] ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        {title}
      </div>

      {entries.length === 0 ? (
        <div className="mt-3 text-sm text-text-secondary">No data.</div>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map(([k, v]) => {
            const pct = max > 0 ? Math.round((v / max) * 100) : 0;
            return (
              <div key={k} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-text-primary">{k}</div>
                  <div className="text-sm text-text-secondary">{v}</div>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default KeyValueBarsCard;