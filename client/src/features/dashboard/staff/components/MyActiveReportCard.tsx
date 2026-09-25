import { Link } from "react-router-dom";
import { getCategoryLabel } from "../../../reports/constants";
import StatusBadge from "../../../reports/components/StatusBadge";
import type { StaffDashboardActiveReport } from "../types";

type Props = {
  items: StaffDashboardActiveReport[];
};

const MyActiveReportsCard = ({ items }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          My active reports
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-5 text-sm text-text-secondary">
          No active reports assigned to you.
        </div>
      ) : (
        <div className="divide-y divide-border">
          {items.map((r) => {
            const thumb = r.photos?.[0]?.url ?? null;
            return (
              <Link
                key={r.id}
                to={`/reports/${r.id}`}
                className="flex items-start gap-3 p-4 hover:bg-surface-sunken"
              >
                <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-border bg-surface-sunken">
                  {thumb ? (
                    <img
                      src={thumb}
                      alt=""
                      className="h-full w-full object-cover"
                      loading="lazy"
                      decoding="async"
                    />
                  ) : null}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="truncate text-sm font-semibold text-text-primary">
                      {r.title}
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={r.status} />
                    </div>
                  </div>

                  <div className="mt-1 text-xs text-text-secondary">
                    {r.category ? getCategoryLabel(r.category) : "—"}
                  </div>

                  <div className="mt-1 text-xs text-text-secondary">
                    {r.assignedAt ? `Assigned: ${new Date(r.assignedAt).toLocaleString()}` : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyActiveReportsCard;