import type { AdminDashboardData } from "../types";

type Props = {
  staffWorkload: AdminDashboardData["staffWorkload"];
};

const StaffWorkloadCard = ({ staffWorkload }: Props) => {
  const rows = [...(staffWorkload.activeByStaff ?? [])].sort(
    (a, b) => b.activeCount - a.activeCount,
  );

  return (
    <div className="rounded-2xl border border-border bg-surface shadow-card overflow-hidden">
      <div className="border-b border-border p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Staff workload (SLA {staffWorkload.slaHours}h)
        </div>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <div className="rounded-xl border border-border bg-surface-sunken p-4">
            <div className="text-xs text-text-secondary">Active assigned</div>
            <div className="mt-1 text-xl font-bold text-text-primary">
              {staffWorkload.activeAssignedCount}
            </div>
          </div>
          <div className="rounded-xl border border-border bg-surface-sunken p-4">
            <div className="text-xs text-text-secondary">Overdue &gt; 48h</div>
            <div className="mt-1 text-xl font-bold text-text-primary">
              {staffWorkload.overdue48hAssignedCount}
            </div>
          </div>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="p-5 text-sm text-text-secondary">No staff workload data.</div>
      ) : (
        <div className="divide-y divide-border">
          {rows.slice(0, 10).map((r) => (
            <div key={r.userId} className="flex items-center justify-between gap-3 p-5">
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold text-text-primary">{r.name}</div>
                <div className="truncate text-xs text-text-secondary">{r.userId}</div>
              </div>
              <div className="shrink-0 rounded-full border border-border bg-surface-sunken px-3 py-1 text-sm font-semibold text-text-primary">
                {r.activeCount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StaffWorkloadCard;