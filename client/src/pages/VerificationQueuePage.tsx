import { useState } from "react";
import useAuthStore from "../stores/authStore";
import Pagination from "../shared/ui/Pagination";

import useVerificationQueueQuery from "../features/verifications/hooks/useVerificationQuery";

import VerificationQueueItemRow from "../features/verifications/components/VerificationQueueItemRow";

const VerificationQueuePage = () => {
  const permissions = useAuthStore((s) => s.permissions);
  const canClaim = permissions.includes("report:claim_verification");

  const [page, setPage] = useState(1);
  const limit = 10;

  const queueQuery = useVerificationQueueQuery({ page, limit });

  return (
    <div>
      <h1 className="text-lg font-semibold text-text-primary">Verification Queue</h1>
      <p className="mt-1 text-sm text-text-secondary">
        Reports awaiting validation.
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
          queueQuery.data.reports.map((r) => {

            return (
              <VerificationQueueItemRow key={r.id} item={r} canClaim={canClaim} />
            );
          })
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            No reports in the queue.
          </div>
        )}
      </div>

      {queueQuery.data ? (
        <Pagination
          page={queueQuery.data.page}
          totalPages={queueQuery.data.totalPages}
          onPageChange={setPage}
        />
      ) : null}
    </div>
  );
};

export default VerificationQueuePage;