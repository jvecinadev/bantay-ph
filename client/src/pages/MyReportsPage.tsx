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

  const selectChevron =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      {/* ============ MAIN COLUMN ============ */}
      <div className="min-w-0">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">My Reports</h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Track your submitted issues.
          </p>
        </div>

        {/* Filters */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label
              htmlFor="filter-category"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
              Category
            </label>
            <select
              id="filter-category"
              className="mt-2 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              style={{
                backgroundImage: selectChevron,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
              value={category}
              onChange={(e) => {
                setPage(1);
                setCategory(e.target.value as any);
              }}
            >
              <option value="">All categories</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor="filter-status"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
              Status
            </label>
            <select
              id="filter-status"
              className="mt-2 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              style={{
                backgroundImage: selectChevron,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
              value={status}
              onChange={(e) => {
                setPage(1);
                setStatus(e.target.value as any);
              }}
            >
              <option value="">All statuses</option>
              {STATUS_OPTIONS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Error */}
        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0s-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{error.message}</span>
          </div>
        ) : null}

        {/* List */}
        <div className="mt-6 space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6"
                >
                  <div className="flex items-center justify-between">
                    <div className="h-5 w-24 rounded-full bg-surface-sunken" />
                    <div className="h-6 w-20 rounded-full bg-surface-sunken" />
                  </div>
                  <div className="mt-4 h-5 w-3/4 rounded bg-surface-sunken" />
                  <div className="mt-3 h-3 w-1/3 rounded bg-surface-sunken" />
                  <div className="mt-4 h-px w-full bg-border" />
                  <div className="mt-4 h-3 w-full rounded bg-surface-sunken" />
                  <div className="mt-2 h-3 w-5/6 rounded bg-surface-sunken" />
                </div>
              ))}
            </>
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
                </svg>
              </div>
              <div className="mt-4 text-sm font-semibold text-text-primary">
                No reports yet
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                You haven't submitted any reports matching these filters.
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {data ? (
          <div className="mt-6">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        ) : null}

        {/* Fetching indicator */}
        {isFetching && !isLoading ? (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-secondary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Updating…
          </div>
        ) : null}
      </div>

      {/* ============ RIGHT RAIL ============ */}
      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          {/* New report CTA */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-light">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h3 className="mt-3 text-sm font-semibold text-text-primary">
              Spotted another issue?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Every report helps your barangay act faster.
            </p>
            <a
              href="/reports/new"
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover"
            >
              Submit a report
            </a>
          </div>

          {/* Status legend */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Status guide
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-reported" />
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">Reported</span> — awaiting review
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-under-verification" />
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">Under verification</span> — being checked
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0ded-full bg-status-verified" />
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">Verified</span> — confirmed valid
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-in-progress" />
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">In progress</span> — staff working
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span className="h-2 w-2 shrink-0 rounded-full bg-status-resolved" />
                <span className="text-sm text-text-secondary">
                  <span className="font-medium text-text-primary">Resolved</span> — issue closed
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

export default MyReportsPage;