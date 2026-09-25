import { Link } from "react-router-dom";
import type { AdminRecentReport } from "../types";
import { getCategoryLabel } from "../../../reports/constants";
import StatusBadge from "../../../reports/components/StatusBadge";

type Props = {
  items: AdminRecentReport[];
};

const RecentReportsCard = ({ items }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Recent reports
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-5 text-sm text-text-secondary">No recent reports.</div>
      ) : (
        <div className="divide-y divide-border">
          {items.slice(0, 8).map((r) => {
            const thumb = r.photos?.[0]?.url ?? null;

            return (
              <Link key={r.id} to={`/reports/${r.id}`} className="flex gap-3 p-4 hover:bg-surface-sunken">
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-sunken">
                  {thumb ? (
                    <img src={thumb} alt="" className="h-full w-full object-cover" loading="lazy" decoding="async" />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate text-sm font-semibold text-text-primary">{r.title}</div>
                    <div className="shrink-0">
                      <StatusBadge status={r.status} />
                    </div>
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {getCategoryLabel(r.category)} • {new Date(r.createdAt).toLocaleString()}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">Reporter: {r.reporter.name}</div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentReportsCard;