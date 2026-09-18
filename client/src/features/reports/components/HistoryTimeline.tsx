import type { ReportHistoryItem } from "../types";
import StatusBadge from "./StatusBadge";

type Props = {
  items: ReportHistoryItem[];
};

const HistoryTimeline = ({ items }: Props) => {
  if (!items.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
        No history available.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {items.map((h) => (
        <div key={h.id} className="rounded-lg border border-border bg-surface p-3">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="text-sm font-medium text-text-primary">
                {h.author?.name} <span className="text-text-secondary">({h.author?.role?.name})</span>
              </div>
              <div className="mt-1 text-xs text-text-secondary">{new Date(h.createdAt).toLocaleString()}</div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {h.oldStatus ? <StatusBadge status={h.oldStatus} /> : null}
              <span className="text-xs text-text-secondary">→</span>
              <StatusBadge status={h.newStatus} />
            </div>
          </div>

          {h.remarks ? <div className="mt-2 text-sm text-text-secondary">{h.remarks}</div> : null}
        </div>
      ))}
    </div>
  );
};

export default HistoryTimeline;