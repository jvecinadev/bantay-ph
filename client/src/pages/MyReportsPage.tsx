import { useState } from "react";
import { Link } from "react-router-dom";
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

  const { data, isLoading, error } = useMyReportsQuery({
    page,
    limit,
    category,
    status,
  });

  const hasFilters = !!category || !!status;

  const selectChevron =
    "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")";

  const selectClass =
    "w-full appearance-none rounded-xl border border-border-strong bg-surface py-2 pl-3 pr-8 text-xs font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 sm:text-sm";

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              My Reports
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              Track your submitted issues.
            </p>
          </div>

          <Link
            to="/reports/new"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:inline-flex"
          >
            <span className="text-base leading-none">+</span>
            New report
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <div className="w-full sm:w-44">
            <select
              id="filter-category"
              aria-label="Filter by category"
              className={selectClass}
              style={{
                backgroundImage: selectChevron,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.6rem center",
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

          <div className="w-full sm:w-40">
            <select
              id="filter-status"
              aria-label="Filter by status"
              className={selectClass}
              style={{
                backgroundImage: selectChevron,
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.6rem center",
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

          {hasFilters ? (
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategory("");
                setStatus("");
              }}
              className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
            >
              Clear
            </button>
          ) : null}
        </div>

        {error ? (
          <div className="mt-6 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{error.message}</span>
          </div>
        ) : null}

        <div className="mt-6 space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="h-5 w-24 rounded-full bg-surface-sunken" />
                    <div className="h-6 w-20 rounded-full bg-surface-sunken" />
                  </div>
                  <div className="mt-4 flex items-start gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="h-4 w-3/4 rounded bg-surface-sunken" />
                      <div className="mt-3 h-3 w-1/3 rounded bg-surface-sunken" />
                    </div>
                    <div className="h-20 w-20 shrink-0 rounded-xl bg-surface-sunken sm:h-24 sm:w-24" />
                  </div>
                </div>
              ))}
            </>
          ) : data?.reports?.length ? (
            data.reports.map((r) => (
              <ReportCard
                key={r.id}
                to={`/reports/${r.id}`}
                title={r.title}
                category={getCategoryLabel(r.category)}
                status={r.status}
                meta={`Created ${new Date(r.createdAt).toLocaleString()}`}
                photoCount={r.photos.length}
                photos={r.photos}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-14 text-center">
              <div className="text-sm font-semibold text-text-primary">
                {hasFilters ? "No matching reports" : "No reports yet"}
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                {hasFilters
                  ? "Try clearing your filters or searching a different combination."
                  : "Reports you submit will show up here so you can track their progress."}
              </div>
              {!hasFilters ? (
                <Link
                  to="/reports/new"
                  className="mt-5 inline-flex items-center gap-1.5 rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-xs font-semibold text-text-primary transition-colors hover:border-primary hover:bg-primary-light hover:text-primary sm:hidden"
                >
                  <span className="text-sm leading-none">+</span>
                  Submit your first report
                </Link>
              ) : null}
            </div>
          )}
        </div>

        {data ? (
          <div className="mt-6">
            <Pagination
              page={data.page}
              totalPages={data.totalPages}
              onPageChange={setPage}
            />
          </div>
        ) : null}
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Status guide
            </h3>
            <ul className="mt-4 space-y-3">
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-reported" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    Reported
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Awaiting review by a validator.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-under-verification" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    Under verification
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    A validator is checking your report.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-verified" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    Verified
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Confirmed valid and now on the feed.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-in-progress" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    In progress
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    Staff are acting on the issue.
                  </div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-status-resolved" />
                <div className="min-w-0">
                  <div className="text-sm font-medium text-text-primary">
                    Resolved
                  </div>
                  <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                    The issue has been closed.
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-surface-sunken p-5">
            <p className="text-xs leading-relaxed text-text-secondary">
              Only verified reports appear on the public feed. Track yours
              here at any stage.
            </p>
          </div>

          <div className="px-2 text-center text-xs text-text-secondary">
            © {new Date().getFullYear()} Bantay PH
          </div>
        </div>
      </aside>
    </div>
  );
};

export default MyReportsPage;