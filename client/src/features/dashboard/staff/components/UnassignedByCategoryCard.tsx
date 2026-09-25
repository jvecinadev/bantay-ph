import { getCategoryLabel } from "../../../reports/constants";
import type { ReportCategory } from "../../../reports/types";

type Props = {
  data: Partial<Record<ReportCategory, number>>;
};

const UnassignedByCategoryCard = ({ data }: Props) => {
  const entries = Object.entries(data ?? {})
    .map(([k, v]) => [k as ReportCategory, Number(v ?? 0)] as const)
    .filter(([, v]) => v > 0)
    .sort((a, b) => b[1] - a[1]);

  const max = entries[0]?.[1] ?? 0;

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Unassigned verified by category
      </div>

      {entries.length === 0 ? (
        <div className="mt-3 text-sm text-text-secondary">
          No unassigned verified reports.
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {entries.map(([cat, count]) => {
            const pct = max > 0 ? Math.round((count / max) * 100) : 0;

            return (
              <div key={cat} className="space-y-1.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-medium text-text-primary">
                    {getCategoryLabel(cat)}
                  </div>
                  <div className="text-sm text-text-secondary">{count}</div>
                </div>

                <div className="h-2 w-full overflow-hidden rounded-full bg-surface-sunken">
                  <div
                    className="h-full rounded-full bg-primary"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default UnassignedByCategoryCard;