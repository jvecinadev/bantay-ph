import { useMemo } from "react";
import useAuthStore from "../../../stores/authStore";
import type { AdminUser, RoleName, UserStatus } from "../types";
import useUpdateUserRoleMutation from "../hooks/useUpdateUserRoleMutation";
import useUpdateUserStatusMutation from "../hooks/useUpdateUserStatusMutation";

type Props = {
  user: AdminUser;
};

const ROLE_OPTIONS: RoleName[] = ["RESIDENT", "VALIDATOR", "BARANGAY_STAFF", "ADMIN"];

const UserCard = ({ user }: Props) => {
  const permissions = useAuthStore((s) => s.permissions);

  const canUpdateRole = permissions.includes("user:update_role");
  const canUpdateStatus = permissions.includes("user:update_status");

  const roleMutation = useUpdateUserRoleMutation(user.id);
  const statusMutation = useUpdateUserStatusMutation(user.id);

  const statusLabel = useMemo(() => user.status, [user.status]);

  const nextStatus: UserStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-text-primary">{user.name}</div>
          <div className="mt-1 truncate text-xs text-text-secondary">{user.email}</div>
          <div className="mt-2 text-xs text-text-secondary">
            Role: <span className="text-text-primary">{user.role?.name}</span> • Status:{" "}
            <span className="text-text-primary">{statusLabel}</span>
          </div>
        </div>

        <div className="shrink-0">
          <span
            className={[
              "inline-flex items-center rounded-full border border-border px-2.5 py-1 text-xs font-medium",
              user.status === "ACTIVE" ? "bg-success-light text-success" : "bg-danger-light text-danger",
            ].join(" ")}
          >
            {user.status}
          </span>
        </div>
      </div>

      {(roleMutation.error || statusMutation.error) ? (
        <div className="mt-3 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {(roleMutation.error?.message || statusMutation.error?.message) ?? "Update failed."}
        </div>
      ) : null}

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-text-secondary">Change role</label>
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary disabled:opacity-60"
            value={user.role?.name}
            disabled={!canUpdateRole || roleMutation.isPending}
            onChange={(e) => roleMutation.mutate(e.target.value as RoleName)}
          >
            {ROLE_OPTIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col justify-end">
          <button
            type="button"
            disabled={!canUpdateStatus || statusMutation.isPending}
            onClick={() => statusMutation.mutate(nextStatus)}
            className={[
              "rounded-lg px-3 py-2 text-sm font-medium disabled:opacity-60",
              nextStatus === "INACTIVE" ? "bg-danger text-surface" : "bg-success text-surface",
            ].join(" ")}
          >
            {statusMutation.isPending ? "Updating…" : nextStatus === "INACTIVE" ? "Deactivate" : "Activate"}
          </button>
          <div className="mt-1 text-xs text-text-secondary">
            Sets status to <span className="text-text-primary">{nextStatus}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserCard;