import { useState } from "react";
import useMyReportsQuery from "../features/reports/hooks/useMyReportsQuery";
import { CATEGORY_OPTIONS, STATUS_OPTIONS, getCategoryLabel } from "../features/reports/constants";
import type { ReportCategory, ReportStatus } from "../features/reports/types";
import Pagination from "../shared/ui/Pagination";
import ReportCard from "../features/reports/components/ReportCard";

const MyReportsPage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ReportCategory | "">("");
  const [status, setStatus] = useState<ReportStatus | "">("");
  const limit = 10;

  const { data, isLoading, error, isFetching } = useMyReportsQuery({
    page,
    limit,
    category,
    status,
  });

  return (
    <div>
      <h1 className="text-lg font-semibold text-text-primary">My Reports</h1>
      <p className="mt-1 text-sm text-text-secondary">Track your submitted issues.</p>

      <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm text-text-secondary">Category</label>
          <select
            className="mt-1 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary"
            value={category}
            onChange={(e) => {
              setPage(1);
              setCategory(e.target.value as any);
            }}
          >
            <option value="">All</option>
            {CATEGORY_OPTIONS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </div>

        <div>
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
            {STATUS_OPTIONS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            Loading your reports…
          </div>
        ) : data?.reports?.length ? (
          data.reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              category={getCategoryLabel(r.category)}
              status={r.status}
              meta={`Created ${new Date(r.createdAt).toLocaleString()}`}
            />
          ))
        ) : (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            No reports found.
          </div>
        )}
      </div>

      {data ? (
        <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
      ) : null}

      {isFetching && !isLoading ? (
        <div className="mt-2 text-xs text-text-secondary">Updating…</div>
      ) : null}
    </div>
  );
};

export default MyReportsPage;