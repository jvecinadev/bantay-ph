import { Link } from "react-router-dom";
import type { StaffDashboardPreviewReport } from "../types";
import { getCategoryLabel } from "../../../reports/constants"; 

type Props = {
  items: StaffDashboardPreviewReport[];
};

const UnassignedVerifiedPreview = ({ items }: Props) => {
  if (!items.length) {
    return (
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card text-sm text-text-secondary">
        No unassigned verified reports right now.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="divide-y divide-border">
        {items.slice(0, 8).map((r) => {
          const thumb = r.photos?.[0]?.url ?? null;

          return (
            <Link
              key={r.id}
              to={`/reports/${r.id}`}
              className="flex gap-3 p-4 hover:bg-surface-sunken"
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
                <div className="truncate text-sm font-semibold text-text-primary">
                  {r.title}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">
                  {getCategoryLabel(r.category)} • {new Date(r.createdAt).toLocaleString()}
                </div>
                <div className="mt-0.5 text-xs text-text-secondary">
                  Reporter: {r.reporter?.name}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UnassignedVerifiedPreview;