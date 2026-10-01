import { Link } from "react-router-dom";
import useAuthStore from "../../../stores/authStore";
import { getInitials } from "../../../lib/helper/getInitials";
import type { AdminUser, RoleName, UserStatus } from "../types";
import useUpdateUserRoleMutation from "../hooks/useUpdateUserRoleMutation";
import useUpdateUserStatusMutation from "../hooks/useUpdateUserStatusMutation";
import { ROLE_OPTIONS, ROLE_TINTS } from "../constants";

type Props = {
  user: AdminUser;
};

const UserRow = ({ user }: Props) => {
  const permissions = useAuthStore((s) => s.permissions);
  const canUpdateRole = permissions.includes("user:update_role");
  const canUpdateStatus = permissions.includes("user:update_status");

  const roleMutation = useUpdateUserRoleMutation(user.id);
  const statusMutation = useUpdateUserStatusMutation(user.id);

  const isActive = user.status === "ACTIVE";
  const nextStatus: UserStatus = isActive ? "INACTIVE" : "ACTIVE";
  const roleName = user.role?.name ?? "RESIDENT";
  const roleTint = ROLE_TINTS[roleName] ?? ROLE_TINTS.RESIDENT;
  const initials = getInitials(user.name);
  const avatarUrl = user.profile?.avatarUrl ?? null;
  const actionError = roleMutation.error?.message || statusMutation.error?.message;

  return (
    <div className="grid grid-cols-1 gap-3 px-5 py-3.5 transition-colors hover:bg-surface-sunken/40 md:grid-cols-[minmax(0,1fr)_130px_130px_220px] md:items-center md:gap-6">
      <Link
        to={`/user/${user.id}/profile`}
        className="group flex min-w-0 items-center gap-3 rounded-lg focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-sunken">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-[11px] font-bold text-text-secondary">
              {initials}
            </span>
          )}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold text-text-primary transition-colors group-hover:text-primary">
            {user.name}
          </span>
          <span className="block truncate text-xs text-text-secondary">
            {user.email}
          </span>
        </span>
      </Link>

      <div className="flex items-center gap-2 md:block">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary md:hidden">
          Role
        </span>
        <span
          className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${roleTint}`}
        >
          {roleName.replace(/_/g, " ")}
        </span>
      </div>

      <div className="flex items-center gap-2 md:block">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary md:hidden">
          Status
        </span>
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
          {user.status}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2 md:justify-end">
        <select
          value={user.role?.name}
          disabled={!canUpdateRole || roleMutation.isPending}
          onChange={(e) => roleMutation.mutate(e.target.value as RoleName)}
          className="min-w-0 flex-1 rounded-lg border border-border-strong bg-surface px-2.5 py-1.5 text-xs font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:bg-surface-sunken disabled:text-text-secondary md:flex-none md:w-25"
        >
          {ROLE_OPTIONS.map((r) => (
            <option key={r} value={r}>
              {r.replace(/_/g, " ")}
            </option>
          ))}
        </select>

        <button
          type="button"
          disabled={!canUpdateStatus || statusMutation.isPending}
          onClick={() => statusMutation.mutate(nextStatus)}
          className={[
            "inline-flex shrink-0 items-center justify-center rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors focus:outline-none focus-visible:ring-4 disabled:cursor-not-allowed disabled:opacity-50",
            nextStatus === "INACTIVE"
              ? "bg-danger-light text-danger hover:bg-danger hover:text-surface focus-visible:ring-danger/20"
              : "bg-success-light text-success hover:bg-success hover:text-surface focus-visible:ring-success/20",
          ].join(" ")}
        >
          {statusMutation.isPending
            ? "…"
            : nextStatus === "INACTIVE"
              ? "Deactivate"
              : "Activate"}
        </button>
      </div>

      {actionError ? (
        <div className="col-span-full flex items-start gap-2 rounded-lg border border-danger/30 bg-danger-light px-3 py-2 text-[11px] text-danger">
          <span className="mt-0.5 inline-flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[9px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{actionError}</span>
        </div>
      ) : null}
    </div>
  );
};

export default UserRow;