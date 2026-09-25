import { useState } from "react";
import useStaffQueueQuery from "../features/staff/hooks/useStaffQueueQuery";
import Pagination from "../shared/ui/Pagination";
import StaffQueueItemCard from "../features/staff/components/StaffQueueItemCard";

const StaffQueuePage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const queueQuery = useStaffQueueQuery({ page, limit });

  return (
    <div className="w-full">
      <h1 className="text-2xl font-bold tracking-tight text-text-primary">
        Staff Queue
      </h1>
      <p className="mt-1.5 text-sm text-text-secondary">
        Verified and unassigned reports ready for action.
      </p>

      {queueQuery.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{queueQuery.error.message}</span>
        </div>
      ) : null}

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        {queueQuery.isLoading ? (
          <div className="rounded-2xl border border-border bg-surface p-5 text-sm text-text-secondary shadow-card md:col-span-2">
            Loading queue…
          </div>
        ) : queueQuery.data?.reports?.length ? (
          queueQuery.data.reports.map((r) => (
            <StaffQueueItemCard key={r.id} item={r} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-14 text-center md:col-span-2">
            <div className="text-sm font-semibold text-text-primary">
              Queue is empty
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              All caught up. Verified reports will appear here once they're
              ready for staff action.
            </div>
          </div>
        )}
      </div>

      {queueQuery.data ? (
        <div className="mt-6">
          <Pagination
            page={queueQuery.data.page}
            totalPages={queueQuery.data.totalPages}
            onPageChange={setPage}
          />
        </div>
      ) : null}
    </div>
  );
};

export default StaffQueuePage;