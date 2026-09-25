import type { AdminRecentAuditLog } from "../types";

type Props = {
  items: AdminRecentAuditLog[];
};

const RecentAuditLogsCard = ({ items }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Recent audit logs
        </div>
      </div>

      {items.length === 0 ? (
        <div className="p-5 text-sm text-text-secondary">No recent audit logs.</div>
      ) : (
        <div className="divide-y divide-border">
          {items.slice(0, 8).map((a) => (
            <div key={a.id} className="p-4">
              <div className="text-sm font-semibold text-text-primary">{a.action}</div>
              <div className="mt-1 text-xs text-text-secondary">
                {a.user.name} • {a.entityType}
                {a.entityId ? ` • ${a.entityId}` : ""} • {new Date(a.createdAt).toLocaleString()}
              </div>
              {a.details ? (
                <div className="mt-2 text-xs text-text-secondary line-clamp-2">
                  {a.details}
                </div>
              ) : null}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentAuditLogsCard;