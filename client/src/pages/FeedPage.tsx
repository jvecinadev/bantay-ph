import { useState } from "react";
import useFeedReportsQuery from "../features/reports/hooks/useFeedReportsQuery";
import { CATEGORY_OPTIONS, getCategoryLabel } from "../features/reports/constants";
import type { ReportCategory } from "../features/reports/types";
import Pagination from "../shared/ui/Pagination";
import ReportCard from "../features/reports/components/ReportCard";

const FeedPage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ReportCategory | "">("");
  const limit = 10;

  const { data, isLoading, error, isFetching } = useFeedReportsQuery({ page, limit, category });

  return (
    <div>
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-lg font-semibold text-text-primary">Feed</h1>
          <p className="mt-1 text-sm text-text-secondary">
            Verified and above reports from the community.
          </p>
        </div>

        <div className="w-full sm:w-64">
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
      </div>

      {error ? (
        <div className="mt-4 rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
          {error.message}
        </div>
      ) : null}

      <div className="mt-4 space-y-3">
        {isLoading ? (
          <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
            Loading feed…
          </div>
        ) : data?.reports?.length ? (
          data.reports.map((r) => (
            <ReportCard
              key={r.id}
              title={r.title}
              category={getCategoryLabel(r.category)}
              status={r.status}
              meta={`Reported by ${r.reporter?.name ?? "Unknown"}`}
              description={r.description}
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

export default FeedPage;