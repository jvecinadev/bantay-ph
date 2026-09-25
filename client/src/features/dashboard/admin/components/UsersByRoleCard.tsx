import type { AdminUsersByRoleItem } from "../types";

type Props = {
  total: number;
  active: number;
  inactive: number;
  roles: AdminUsersByRoleItem[];
};

const UsersByRoleCard = ({ total, active, inactive, roles }: Props) => {
  const sorted = [...(roles ?? [])].sort((a, b) => b.count - a.count);

  return (
    <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Users
      </div>

      <div className="mt-3 grid grid-cols-3 gap-3">
        <div className="rounded-xl border border-border bg-surface-sunken p-4">
          <div className="text-xs text-text-secondary">Total</div>
          <div className="mt-1 text-xl font-bold text-text-primary">{total}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-sunken p-4">
          <div className="text-xs text-text-secondary">Active</div>
          <div className="mt-1 text-xl font-bold text-text-primary">{active}</div>
        </div>
        <div className="rounded-xl border border-border bg-surface-sunken p-4">
          <div className="text-xs text-text-secondary">Inactive</div>
          <div className="mt-1 text-xl font-bold text-text-primary">{inactive}</div>
        </div>
      </div>

      <div className="mt-4 border-t border-border pt-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          By role
        </div>

        {sorted.length === 0 ? (
          <div className="mt-2 text-sm text-text-secondary">No role data.</div>
        ) : (
          <div className="mt-3 space-y-2">
            {sorted.map((r) => (
              <div key={r.roleId} className="flex items-center justify-between gap-3">
                <div className="text-sm font-medium text-text-primary">{r.roleName}</div>
                <div className="text-sm text-text-secondary">{r.count}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersByRoleCard;