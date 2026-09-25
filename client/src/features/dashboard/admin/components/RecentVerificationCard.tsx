import { Link } from "react-router-dom";
import type { AdminRecentVerification } from "../types";
import { getCategoryLabel } from "../../../reports/constants";

type Props = {
  items: AdminRecentVerification[];
};

const RecentVerificationsCard = ({ items }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Recent verifications
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-5 text-sm text-text-secondary">No recent verifications.</div>
      ) : (
        <div className="divide-y divide-border">
          {items.slice(0, 8).map((v) => (
            <Link
              key={v.id}
              to={`/reports/${v.reportId}`}
              className="block p-4 hover:bg-surface-sunken"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-text-primary">
                    {v.newStatus} • {v.report.title}
                  </div>
                  <div className="mt-1 text-xs text-text-secondary">
                    {getCategoryLabel(v.report.category)} • {v.author.name}
                  </div>
                </div>
                <div className="shrink-0 text-xs text-text-secondary">
                  {new Date(v.createdAt).toLocaleString()}
                </div>
              </div>

              {v.remarks ? (
                <div className="mt-2 text-xs text-text-secondary line-clamp-2">
                  {v.remarks}
                </div>
              ) : null}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentVerificationsCard;