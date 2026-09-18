import { useState } from "react";
import useAuditLogsQuery from "../features/admin/hooks/useAuditLogsQuery";
import Pagination from "../shared/ui/Pagination";
import AuditLogCard from "../features/admin/components/AuditLogCard";

const AuditLogsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [userId, setUserId] = useState("");

  const logsQuery = useAuditLogsQuery({ page, limit, action, entityType, entityId, userId });

  const hasActiveFilters = !!action || !!entityType || !!entityId || !!userId;

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      {/* ============ MAIN COLUMN ============ */}
      <div className="min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Audit Logs
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            System activity trail for accountability.
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
                  setAction("");
                  setEntityType("");
                  setEntityId("");
                  setUserId("");
                }}
                className="rounded-md px-2 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary-light focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                Clear all
              </button>
            ) : null}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {/* Action */}
            <div>
              <label
                htmlFor="filter-action"
                className="block text-xs font-medium text-text-primary"
              >
                Action
              </label>
              <input
                id="filter-action"
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-mono text-text-primary placeholder:font-sans placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                value={action}
                onChange={(e) => {
                  setPage(1);
                  setAction(e.target.value);
                }}
                placeholder="e.g. REPORT_ASSIGNED"
              />
            </div>

            {/* Entity Type */}
            <div>
              <label
                htmlFor="filter-entity-type"
                className="block text-xs font-medium text-text-primary"
              >
                Entity type
              </label>
              <input
                id="filter-entity-type"
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-mono text-text-primary placeholder:font-sans placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                value={entityType}
                onChange={(e) => {
                  setPage(1);
                  setEntityType(e.target.value);
                }}
                placeholder="e.g. REPORT"
              />
            </div>

            {/* Entity ID */}
            <div>
              <label
                htmlFor="filter-entity-id"
                className="block text-xs font-medium text-text-primary"
              >
                Entity ID
              </label>
              <input
                id="filter-entity-id"
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-mono text-text-primary placeholder:font-sans placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                value={entityId}
                onChange={(e) => {
                  setPage(1);
                  setEntityId(e.target.value);
                }}
                placeholder="UUID…"
              />
            </div>

            {/* User ID */}
            <div>
              <label
                htmlFor="filter-user-id"
                className="block text-xs font-medium text-text-primary"
              >
                User ID
              </label>
              <input
                id="filter-user-id"
                className="mt-1.5 w-full rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 text-sm font-mono text-text-primary placeholder:font-sans placeholder:text-text-secondary/60 transition-colors focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
                value={userId}
                onChange={(e) => {
                  setPage(1);
                  setUserId(e.target.value);
                }}
                placeholder="UUID…"
              />
            </div>
          </div>
        </div>

        {/* Error */}
        {logsQuery.error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{logsQuery.error.message}</span>
          </div>
        ) : null}

        {/* List */}
        <div className="mt-6 space-y-4">
          {logsQuery.isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
                >
                  <div className="p-5 sm:p-6">
                    <div className="flex items-start gap-4">
                      <div className="h-10 w-10 shrink-0 rounded-full bg-surface-sunken" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <div className="h-5 w-28 rounded-full bg-surface-sunken" />
                          <div className="h-3 w-24 rounded bg-surface-sunken" />
                        </div>
                        <div className="mt-3 h-3 w-2/3 rounded bg-surface-sunken" />
                        <div className="mt-2 h-3 w-1/3 rounded bg-surface-sunken" />
                      </div>
                    </div>
                  </div>
                  <div className="border-t border-border bg-surface-sunken/50 p-5 sm:p-6">
                    <div className="h-3 w-16 rounded bg-surface-sunken" />
                    <div className="mt-3 space-y-2">
                      <div className="h-8 w-full rounded-lg bg-surface-sunken" />
                      <div className="h-8 w-full rounded-lg bg-surface-sunken" />
                    </div>
                  </div>
                </div>
              ))}
            </>
          ) : logsQuery.data?.logs?.length ? (
            logsQuery.data.logs.map((l) => <AuditLogCard key={l.id} log={l} />)
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
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                  <line x1="9" y1="13" x2="15" y2="13" />
                  <line x1="9" y1="17" x2="15" y2="17" />
                </svg>
              </div>
              <div className="mt-4 text-sm font-semibold text-text-primary">
                No logs found
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                {hasActiveFilters
                  ? "Try adjusting your filters or search query."
                  : "System activity will appear here as users act."}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {logsQuery.data ? (
          <div className="mt-6">
            <Pagination
              page={logsQuery.data.page}
              totalPages={logsQuery.data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      {/* ============ RIGHT RAIL ============ */}
      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          {/* How to search */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              How to search
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  A
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Action
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Filter by action name like{" "}
                    <code className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[10px] text-text-primary">
                      REPORT_ASSIGNED
                    </code>
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  E
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    Entity
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Type + ID narrow to one record. E.g.{" "}
                    <code className="rounded bg-surface-sunken px-1 py-0.5 font-mono text-[10px] text-text-primary">
                      REPORT
                    </code>{" "}
                    + a UUID.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  U
                </span>
                <div className="min-w-0">
                  <div className="text-sm font-semibold text-text-primary">
                    User
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    See everything one user did by pasting their user ID.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          {/* Action tint legend */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Color guide
            </h3>
            <ul className="mt-4 space-y-2.5">
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-success" />
                <span className="text-xs text-text-secondary">
                  Created / approved
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-verified" />
                <span className="text-xs text-text-secondary">
                  Updated / edited
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-danger" />
                <span className="text-xs text-text-secondary">
                  Deleted / rejected
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-assigned" />
                <span className="text-xs text-text-secondary">
                  Auth events
                </span>
              </li>
            </ul>
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

export default AuditLogsPage;