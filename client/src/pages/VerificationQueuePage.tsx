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

  const totalCount = queueQuery.data?.total ?? queueQuery.data?.reports?.length ?? 0;
  const hasItems = (queueQuery.data?.reports?.length ?? 0) > 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <header>
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Verification Queue
          </h1>

          {!queueQuery.isLoading && hasItems ? (
            <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text-secondary">
              {totalCount}
            </span>
          ) : null}
        </div>

        <p className="mt-1.5 text-sm text-text-secondary">
          Reports awaiting validation. Claim one to start reviewing.
        </p>
      </header>

      {queueQuery.error ? (
        <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{queueQuery.error.message}</span>
        </div>
      ) : null}

      <div className="mt-6 space-y-4">
        {queueQuery.isLoading ? (
          <>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse overflow-hidden rounded-2xl border border-border bg-surface shadow-card"
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="h-5 w-24 rounded-full bg-surface-sunken" />
                    <div className="h-6 w-20 rounded-full bg-surface-sunken" />
                  </div>
                  <div className="mt-3 flex items-start gap-3">
                    <div className="flex-1">
                      <div className="h-4 w-3/4 rounded bg-surface-sunken" />
                      <div className="mt-2 h-3 w-1/2 rounded bg-surface-sunken" />
                      <div className="mt-3 h-3 w-full rounded bg-surface-sunken" />
                      <div className="mt-1.5 h-3 w-4/6 rounded bg-surface-sunken" />
                    </div>
                    <div className="h-16 w-16 shrink-0 rounded-lg bg-surface-sunken sm:h-20 sm:w-20" />
                  </div>
                </div>
                <div className="flex items-center justify-between border-t border-border bg-surface-sunken/50 px-4 py-3 sm:px-5">
                  <div className="h-3 w-32 rounded bg-surface-sunken" />
                  <div className="h-8 w-16 rounded-lg bg-surface-sunken" />
                </div>
              </div>
            ))}
          </>
        ) : hasItems ? (
          queueQuery.data!.reports.map((r) => (
            <VerificationQueueItemRow key={r.id} item={r} canClaim={canClaim} />
          ))
        ) : (
          <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-14 text-center">
            <div className="text-sm font-semibold text-text-primary">
              Queue is empty
            </div>
            <div className="mt-1 text-xs text-text-secondary">
              All caught up. New reports will appear here as they're
              submitted.
            </div>
          </div>
        )}
      </div>

      {queueQuery.data && queueQuery.data.totalPages > 1 ? (
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

export default VerificationQueuePage;