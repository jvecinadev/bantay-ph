import type { RoleName, UserStatus } from "../types";
import { ROLE_OPTIONS } from "../constants";

type Props = {
  search: string;
  role: RoleName | "";
  status: UserStatus | "";
  hasActiveFilters: boolean;
  onSearchChange: (v: string) => void;
  onRoleChange: (v: RoleName | "") => void;
  onStatusChange: (v: UserStatus | "") => void;
  onClear: () => void;
};

const controlClass =
  "rounded-lg border border-border-strong bg-surface px-2.5 py-2 text-xs font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

const UsersToolbar = ({
  search,
  role,
  status,
  hasActiveFilters,
  onSearchChange,
  onRoleChange,
  onStatusChange,
  onClear,
}: Props) => (
  <div className="flex flex-wrap items-center gap-2">
    <input
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
      placeholder="Search name or email…"
      className={`${controlClass} min-w-0 flex-1 sm:max-w-xs`}
    />

    <select
      value={role}
      onChange={(e) => onRoleChange(e.target.value as RoleName | "")}
      className={controlClass}
    >
      <option value="">All roles</option>
      {ROLE_OPTIONS.map((r) => (
        <option key={r} value={r}>
          {r.replace(/_/g, " ")}
        </option>
      ))}
    </select>

    <select
      value={status}
      onChange={(e) => onStatusChange(e.target.value as UserStatus | "")}
      className={controlClass}
    >
      <option value="">All statuses</option>
      <option value="ACTIVE">Active</option>
      <option value="INACTIVE">Inactive</option>
    </select>

    {hasActiveFilters ? (
      <button
        type="button"
        onClick={onClear}
        className="rounded-lg px-2.5 py-2 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
      >
        Clear
      </button>
    ) : null}
  </div>
);

export default UsersToolbar;