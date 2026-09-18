import { useMemo } from "react";
import useAuthStore from "../../../stores/authStore";
import type { AdminUser, RoleName, UserStatus } from "../types";
import useUpdateUserRoleMutation from "../hooks/useUpdateUserRoleMutation";
import useUpdateUserStatusMutation from "../hooks/useUpdateUserStatusMutation";

type Props = {
  user: AdminUser;
};

const ROLE_OPTIONS: RoleName[] = ["RESIDENT", "VALIDATOR", "BARANGAY_STAFF", "ADMIN"];

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const ROLE_TINTS: Record<RoleName, string> = {
  RESIDENT: "bg-surface-sunken text-text-secondary",
  VALIDATOR: "bg-status-under-verification-bg text-status-under-verification",
  BARANGAY_STAFF: "bg-status-assigned-bg text-status-assigned",
  ADMIN: "bg-primary-light text-primary",
};

const UserCard = ({ user }: Props) => {
  const permissions = useAuthStore((s) => s.permissions);

  const canUpdateRole = permissions.includes("user:update_role");
  const canUpdateStatus = permissions.includes("user:update_status");

  const roleMutation = useUpdateUserRoleMutation(user.id);
  const statusMutation = useUpdateUserStatusMutation(user.id);

  const statusLabel = useMemo(() => user.status, [user.status]);

  const nextStatus: UserStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";

  const initials = getInitials(user.name);
  const isActive = user.status === "ACTIVE";
  const roleName = (user.role?.name as RoleName) ?? "RESIDENT";
  const roleTint = ROLE_TINTS[roleName] ?? ROLE_TINTS.RESIDENT;

  const hasError = roleMutation.error || statusMutation.error;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-colors hover:border-border-strong">
      {/* ============ HEADER ============ */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* Avatar with initials */}
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold",
              isActive
                ? "bg-primary-light text-primary"
                : "bg-surface-sunken text-text-secondary",
            ].join(" ")}
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Identity block */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="truncate text-base font-semibold tracking-tight text-text-primary">
                {user.name}
              </h3>

              {/* Status dot pill */}
              <span
                className={[
                  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                  isActive
                    ? "bg-success-light text-success"
                    : "bg-danger-light text-danger",
                ].join(" ")}
              >
                <span
                  className={[
                    "h-1.5 w-1.5 rounded-full",
                    isActive ? "bg-success" : "bg-danger",
                  ].join(" ")}
                />
                {statusLabel}
              </span>
            </div>

            <div className="mt-1 truncate text-sm text-text-secondary">
              {user.email}
            </div>

            {/* Role chip */}
            <div className="mt-2.5">
              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                  roleTint,
                ].join(" ")}
              >
                {roleName.replace(/_/g, " ")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ============ ERROR ============ */}
      {hasError ? (
        <div className="px-5 pb-4 sm:px-6">
          <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">
              {(roleMutation.error?.message || statusMutation.error?.message) ??
                "Update failed."}
            </span>
          </div>
        </div>
      ) : null}

      {/* ============ ACTIONS ============ */}
      <div className="border-t border-border bg-surface-sunken/50 p-5 sm:p-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Manage
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Role selector */}
          <div>
            <label
              htmlFor={`role-${user.id}`}
              className="block text-xs font-medium text-text-primary"
            >
              Role
            </label>
            <select
              id={`role-${user.id}`}
              className="mt-1.5 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-secondary"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
              value={user.role?.name}
              disabled={!canUpdateRole || roleMutation.isPending}
              onChange={(e) => roleMutation.mutate(e.target.value as RoleName)}
            >
              {ROLE_OPTIONS.map((r) => (
                <option key={r} value={r}>
                  {r.replace(/_/g, " ")}
                </option>
              ))}
            </select>
            <div className="mt-1.5 text-xs text-text-secondary">
              {roleMutation.isPending
                ? "Saving…"
                : canUpdateRole
                  ? "Changes apply immediately."
                  : "You don't have permission."}
            </div>
          </div>

          {/* Status toggle */}
          <div>
            <div className="block text-xs font-medium text-text-primary">
              Status
            </div>
            <button
              type="button"
              disabled={!canUpdateStatus || statusMutation.isPending}
              onClick={() => statusMutation.mutate(nextStatus)}
              className={[
                "mt-1.5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none",
                nextStatus === "INACTIVE"
                  ? "bg-danger hover:brightness-95 focus-visible:ring-danger/20"
                  : "bg-success hover:brightness-95 focus-visible:ring-success/20",
              ].join(" ")}
            >
              {statusMutation.isPending
                ? "Updating…"
                : nextStatus === "INACTIVE"
                  ? "Deactivate user"
                  : "Activate user"}
            </button>
            <div className="mt-1.5 text-xs text-text-secondary">
              Sets status to{" "}
              <span className="font-medium text-text-primary">{nextStatus}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default UserCard;    