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

  return (
    <div>
      <h1 className="text-lg font-semibold text-text-primary">Users</h1>
      <p className="mt-1 text-sm text-text-secondary">Manage user roles and activation status.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="sm:col-span-1">
          <label className="text-sm text-text-secondary">Search</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={search}
            onChange={(e) => {
              setPage(1);
              setSearch(e.target.value);
            }}
            placeholder="Name or email…"
          />
        </div>

        <div className="sm:col-span-1">
          <label className="text-sm text-text-secondary">Role</label>
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={role}
            onChange={(e) => {
              setPage(1);
              setRole(e.target.value as any);
            }}
          >
            <option value="">All</option>
            <option value="RESIDENT">RESIDENT</option>
            <option value="VALIDATOR">VALIDATOR</option>
            <option value="BARANGAY_STAFF">BARANGAY_STAFF</option>
            <option value="ADMIN">ADMIN</option>
          </select>
        </div>

        <div className="sm:col-span-1">
          <label className="text-sm text-text-secondary">Status</label>
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={status}
            onChange={(e) => {
              setPage(1);
              setStatus(e.target.value as any);
            }}
          >
            <option value="">All</option>
            <option value="ACTIVE">ACTIVE</option>
            <option value="INACTIVE">INACTIVE</option>
          </select>
        </div>
      </div>

      {usersQuery.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {usersQuery.error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {usersQuery.isLoading ? (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            Loading users…
          </div>
        ) : usersQuery.data?.users?.length ? (
          usersQuery.data.users.map((u) => <UserCard key={u.id} user={u} />)
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            No users found.
          </div>
        )}
      </div>

      {usersQuery.data ? (
        <Pagination page={usersQuery.data.page} totalPages={usersQuery.data.totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  );
};

export default UsersPage;