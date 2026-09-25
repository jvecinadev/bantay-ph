import { Link } from "react-router-dom";
import { getCategoryLabel } from "../../../reports/constants";
import StatusBadge from "../../../reports/components/StatusBadge";
import type { StaffDashboardActiveReport } from "../types";

type Props = {
  items: StaffDashboardActiveReport[];
};

const MyActiveReportsCard = ({ items }: Props) => {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          My active reports
        </div>

        {items.length > 0 ? (
          <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
            {items.length}
          </span>
        ) : null}
      </div>

      {items.length === 0 ? (
        <div className="px-5 py-10 text-center">
          <div className="text-sm font-semibold text-text-primary">
            No active reports
          </div>
          <div className="mt-1 text-xs text-text-secondary">
            Reports assigned to you will appear here.
          </div>
        </div>
      ) : (
        <div className="max-h-104 flex-1 divide-y divide-border overflow-y-auto">
          {items.map((r) => {
            const thumb = r.photos?.[0]?.url ?? null;

            return (
              <Link
                key={r.id}
                to={`/reports/${r.id}`}
                className="group flex items-start gap-3 px-5 py-3.5 transition-colors hover:bg-surface-sunken focus:outline-none focus-visible:bg-surface-sunken"
              >
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-border bg-surface-sunken">
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
                    <div className="truncate text-sm font-semibold leading-snug text-text-primary transition-colors group-hover:text-primary">
                      {r.title}
                    </div>
                    <div className="shrink-0">
                      <StatusBadge status={r.status} />
                    </div>
                  </div>

                  <div className="mt-1 flex items-center gap-1.5 text-[11px] text-text-secondary">
                    <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
                    <span className="truncate">
                      {r.category ? getCategoryLabel(r.category) : "Uncategorized"}
                    </span>
                  </div>

                  {r.assignedAt ? (
                    <div className="mt-1 text-[11px] text-text-secondary">
                      Assigned {new Date(r.assignedAt).toLocaleString()}
                    </div>
                  ) : null}
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