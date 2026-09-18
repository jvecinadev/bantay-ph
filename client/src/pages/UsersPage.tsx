import { useState } from "react";
import type { RoleName, UserStatus } from "../features/admin/types";
import useAdminUsersQuery from "../features/admin/hooks/useAdminUsersQuery";
import UserCard from "../features/admin/components/UserCard";
import Pagination from "../shared/ui/Pagination";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleName | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");

  const usersQuery = useAdminUsersQuery({ page, limit, search, role, status });

  const selectChevron =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

  const hasActiveFilters = !!search || !!role || !!status;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      {/* ============ MAIN COLUMN ============ */}
      <div className="min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">Users</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Manage user roles and activation status.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 rounded-2xl border border-border bg-surface p-4 shadow-card sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Filters
            </div>
            {hasActiveFilters ? (
              <button
                type="button"
                onClick={() => {
                  setPage(1);
                  setSearch("");
                  setRole("");
                  setStatus("");
                }}
                className="rounded-md px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Search */}
            <div className="sm:col-span-1">
              <label
                htmlFor="filter-search"
                className="block text-xs font-medium text-text-primary"
              >
                Search
              </label>
              <div className="relative mt-1.5">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary/70">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <circle cx="11" cy="11" r="7" />
                    <line x1="20" y1="20" x2="16.65" y2="16.65" />
                  </svg>
                </span>
                <input
                  id="filter-search"
                  className="w-full rounded-xl border border-border-strong bg-surface py-2.5 pl-9 pr-3.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                  value={search}
                  onChange={(e) => {
                    setPage(1);
                    setSearch(e.target.value);
                  }}
                  placeholder="Name or email…"
                />
              </div>
            </div>

            {/* Role */}
            <div className="sm:col-span-1">
              <label
                htmlFor="filter-role"
                className="block text-xs font-medium text-text-primary"
              >
                Role
              </label>
              <select
                id="filter-role"
                className="mt-1.5 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                style={{
                  backgroundImage: selectChevron,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
                value={role}
                onChange={(e) => {
                  setPage(1);
                  setRole(e.target.value as any);
                }}
              >
                <option value="">All roles</option>
                <option value="RESIDENT">Resident</option>
                <option value="VALIDATOR">Validator</option>
                <option value="BARANGAY_STAFF">Barangay Staff</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            {/* Status */}
            <div className="sm:col-span-1">
              <label
                htmlFor="filter-status"
                className="block text-xs font-medium text-text-primary"
              >
                Status
              </label>
              <select
                id="filter-status"
                className="mt-1.5 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                style={{
                  backgroundImage: selectChevron,
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "right 0.75rem center",
                }}
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value as any);
                }}
              >
                <option value="">All statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
              </select>
            </div>
          </div>
        </div>

        {/* Error */}
        {usersQuery.error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{usersQuery.error.message}</span>
          </div>
        ) : null}

        {/* List */}
        <div className="mt-6 space-y-4">
          {usersQuery.isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-11 w-11 shrink-0 rounded-full bg-surface-sunken" />
                      <div className="min-w-0 flex-1">
                        <div className="h-4 w-1/3 rounded bg-surface-sunken" />
                        <div className="mt-2 h-3 w-1/2 rounded bg-surface-sunken" />
                        <div className="mt-3 h-5 w-20 rounded-full bg-surface-sunken" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border bg-surface-sunken/50 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <div className="h-3 w-12 rounded bg-surface-sunken" />
                        <div className="mt-2 h-10 w-full rounded-xl bg-surface-sunken" />
                      </div>
                      <div>
                        <div className="h-3 w-14 rounded bg-surface-sunken" />
                        <div className="mt-2 h-10 w-full rounded-xl bg-surface-sunken" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : usersQuery.data?.users?.length ? (
            usersQuery.data.users.map((u) => <UserCard key={u.id} user={u} />)
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-surface shadow-card">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-text-secondary"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <div className="mt-4 text-sm font-semibold text-text-primary">
                No users found
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query."
                  : "Users will appear here once they register."}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {usersQuery.data ? (
          <div className="mt-6">
            <Pagination
              page={usersQuery.data.page}
              totalPages={usersQuery.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {/* ============ RIGHT RAIL ============ */}
      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          {/* Role guide */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Role guide
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-text-secondary" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Resident
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Can submit and track their own reports.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-under-verification" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Validator
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Reviews and verifies submitted reports.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-assigned" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Barangay Staff
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Handles assigned reports and marks them resolved.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Admin
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Full access. Manages users, roles, and system settings.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Safety note */}
          <div className="rounded-2xl border border-border bg-surface-sunken p-5">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Heads up
            </h3>
            <p className="mt-3 text-xs leading-relaxed text-text-secondary">
              Role and status changes take effect immediately. Deactivated
              users can't sign in until reactivated.
            </p>
          </div>

          {/* Footer */}
          <div className="px-2 text-center text-xs text-text-secondary">
            © {new Date().getFullYear()} Bantay PH
          </div>
        </div>
      </aside>
    </div>
  );
};

export default UsersPage;