import { useState } from "react";
import useStaffQueueQuery from "../features/staff/hooks/useStaffQueueQuery";
import Pagination from "../shared/ui/Pagination";
import StaffQueueItemCard from "../features/staff/components/StaffQueueItemCard";

const StaffQueuePage = () => {
  const [page, setPage] = useState(1);
  const limit = 10;

  const queueQuery = useStaffQueueQuery({ page, limit });

  return (
    <div>
      <h1 className="text-lg font-semibold text-text-primary">Staff Queue</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Verified and unassigned reports ready for action.
      </p>

      {queueQuery.error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {queueQuery.error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {queueQuery.isLoading ? (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            Loading queue…
          </div>
        ) : queueQuery.data?.reports?.length ? (
          queueQuery.data.reports.map((r) => <StaffQueueItemCard key={r.id} item={r} />)
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            No reports in the queue.
          </div>
        )}
      </div>

      {queueQuery.data ? (
        <Pagination page={queueQuery.data.page} totalPages={queueQuery.data.totalPages} onPageChange={setPage} />
      ) : null}
    </div>
  );
};

export default StaffQueuePage;