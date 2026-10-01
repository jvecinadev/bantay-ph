import { useState } from "react";
import type { RoleName, UserStatus } from "../features/admin/types";
import useAdminUsersQuery from "../features/admin/hooks/useAdminUsersQuery";
import UsersToolbar from "../features/admin/components/UsersToolbar";
import UserTableHeader from "../features/admin/components/UserTableHeader";
import UserTableSkeleton from "../features/admin/components/UserTableSkeleton";
import UserRow from "../features/admin/components/UserRow";
import Pagination from "../shared/ui/Pagination";

const UsersPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [search, setSearch] = useState("");
  const [role, setRole] = useState<RoleName | "">("");
  const [status, setStatus] = useState<UserStatus | "">("");

  const usersQuery = useAdminUsersQuery({ page, limit, search, role, status });

  const hasActiveFilters = !!search || !!role || !!status;
  const totalCount = usersQuery.data?.total ?? usersQuery.data?.users?.length ?? 0;
  const hasItems = (usersQuery.data?.users?.length ?? 0) > 0;

  const handleSearch = (v: string) => {
    setPage(1);
    setSearch(v);
  };

  const handleRole = (v: RoleName | "") => {
    setPage(1);
    setRole(v);
  };

  const handleStatus = (v: UserStatus | "") => {
    setPage(1);
    setStatus(v);
  };

  const handleClear = () => {
    setPage(1);
    setSearch("");
    setRole("");
    setStatus("");
  };

  return (
    <div className="w-full">
      <header>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Users
          </h1>
          {!usersQuery.isLoading && hasItems ? (
            <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
              {totalCount}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm text-text-secondary">
          Manage user roles and activation status.
        </p>
      </header>

      <div className="mt-6">
        <UsersToolbar
          search={search}
          role={role}
          status={status}
          hasActiveFilters={hasActiveFilters}
          onSearchChange={handleSearch}
          onRoleChange={handleRole}
          onStatusChange={handleStatus}
          onClear={handleClear}
        />
      </div>

      {usersQuery.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{usersQuery.error.message}</span>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <UserTableHeader />
        <div className="divide-y divide-border">
          {usersQuery.isLoading ? (
            <UserTableSkeleton />
          ) : hasItems ? (
            usersQuery.data!.users.map((u) => <UserRow key={u.id} user={u} />)
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="text-sm font-semibold text-text-primary">
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
      </div>

      {usersQuery.data && usersQuery.data.totalPages > 1 ? (
        <div className="mt-6">
          <Pagination
            page={usersQuery.data.page}
            totalPages={usersQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default UsersPage;