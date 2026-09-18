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

  return (
    <div>
      <h1 className="text-lg font-semibold text-text-primary">Audit Logs</h1>
      <p className="mt-1 text-sm text-text-secondary">System activity trail for accountability.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <label className="text-sm text-text-secondary">Action</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={action}
            onChange={(e) => {
              setPage(1);
              setAction(e.target.value);
            }}
            placeholder="e.g. REPORT_ASSIGNED"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Entity Type</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={entityType}
            onChange={(e) => {
              setPage(1);
              setEntityType(e.target.value);
            }}
            placeholder="e.g. REPORT / USER"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">Entity ID</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={entityId}
            onChange={(e) => {
              setPage(1);
              setEntityId(e.target.value);
            }}
            placeholder="UUID…"
          />
        </div>

        <div>
          <label className="text-sm text-text-secondary">User ID</label>
          <input
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={userId}
            onChange={(e) => {
              setPage(1);
              setUserId(e.target.value);
            }}
            placeholder="UUID…"
          />
        </div>
      </div>

      {logsQuery.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {logsQuery.error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {logsQuery.isLoading ? (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            Loading logs…
          </div>
        ) : logsQuery.data?.logs?.length ? (
          logsQuery.data.logs.map((l) => <AuditLogCard key={l.id} log={l} />)
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            No logs found.
          </div>
        )}
      </div>

      {logsQuery.data ? (
        <Pagination page={logsQuery.data.page} totalPages={logsQuery.data.totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  );
};

export default AuditLogsPage;