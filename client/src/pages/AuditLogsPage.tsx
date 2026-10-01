import { useState } from "react";
import useAuditLogsQuery from "../features/admin/hooks/useAuditLogsQuery";
import AuditLogsToolbar from "../features/admin/components/AuditLogsToolbar";
import AuditLogTableHeader from "../features/admin/components/AuditLogToolbarHeader";
import AuditLogTableSkeleton from "../features/admin/components/AuditLogTableSkeleton";
import AuditLogRow from "../features/admin/components/AuditLogRow";
import Pagination from "../shared/ui/Pagination";

const AuditLogsPage = () => {
  const [page, setPage] = useState(1);
  const limit = 15;

  const [action, setAction] = useState("");
  const [entityType, setEntityType] = useState("");
  const [entityId, setEntityId] = useState("");
  const [userId, setUserId] = useState("");

  const logsQuery = useAuditLogsQuery({
    page,
    limit,
    action,
    entityType,
    entityId,
    userId,
  });

  const hasActiveFilters = !!action || !!entityType || !!entityId || !!userId;
  const totalCount = logsQuery.data?.total ?? logsQuery.data?.logs?.length ?? 0;
  const hasItems = (logsQuery.data?.logs?.length ?? 0) > 0;

  const handleClear = () => {
    setPage(1);
    setAction("");
    setEntityType("");
    setEntityId("");
    setUserId("");
  };

  return (
    <div className="w-full">
      <header>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Audit Logs
          </h1>
          {!logsQuery.isLoading && hasItems ? (
            <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
              {totalCount}
            </span>
          ) : null}
        </div>
        <p className="mt-1.5 text-sm text-text-secondary">
          System activity trail for accountability.
        </p>
      </header>

      <div className="mt-6">
        <AuditLogsToolbar
          action={action}
          entityType={entityType}
          entityId={entityId}
          userId={userId}
          hasActiveFilters={hasActiveFilters}
          onActionChange={(v) => {
            setPage(1);
            setAction(v);
          }}
          onEntityTypeChange={(v) => {
            setPage(1);
            setEntityType(v);
          }}
          onEntityIdChange={(v) => {
            setPage(1);
            setEntityId(v);
          }}
          onUserIdChange={(v) => {
            setPage(1);
            setUserId(v);
          }}
          onClear={handleClear}
        />
      </div>

      {logsQuery.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{logsQuery.error.message}</span>
        </div>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        <AuditLogTableHeader />
        <div className="divide-y divide-border">
          {logsQuery.isLoading ? (
            <AuditLogTableSkeleton />
          ) : hasItems ? (
            logsQuery.data!.logs.map((l) => <AuditLogRow key={l.id} log={l} />)
          ) : (
            <div className="px-6 py-14 text-center">
              <div className="text-sm font-semibold text-text-primary">
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
      </div>

      {logsQuery.data && logsQuery.data.totalPages > 1 ? (
        <div className="mt-6">
          <Pagination
            page={logsQuery.data.page}
            totalPages={logsQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default AuditLogsPage;