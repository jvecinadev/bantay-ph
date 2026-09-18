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
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      {/* ============ MAIN COLUMN ============ */}
      <div className="min-w-0">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">Feed</h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              Verified and above reports from the community.
            </p>
          </div>

          <div className="w-full sm:w-56">
            <label
              htmlFor="category"
              className="text-xs font-semibold uppercase tracking-wider text-text-secondary"
            >
              Category
            </label>
            <select
              id="category"
              className="mt-2 w-full appearance-none rounded-xl border border-border-strong bg-surface px-3.5 py-2.5 pr-9 text-sm font-medium text-text-primary transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
              style={{
                backgroundImage:
                  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2364748B' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><polyline points='6 9 12 15 18 9'/></svg>\")",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "right 0.75rem center",
              }}
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
                  className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="h-5 w-20 rounded-full bg-surface-sunken" />
                      <div className="mt-3 h-4 w-3/4 rounded bg-surface-sunken" />
                      <div className="mt-2 h-3 w-1/3 rounded bg-surface-sunken" />
                    </div>
                    <div className="h-6 w-20 shrink-0 rounded-full bg-surface-sunken" />
                  </div>
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
                meta={`Reported by ${r.reporter?.name ?? "Unknown"}`}
                description={r.description}
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <div className="mt-4 text-sm font-semibold text-text-primary">
                No reports found
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                Try a different category, or check back later.
              </div>
            </div>
          )}
        </div>

        {data ? (
          <div className="mt-6">
            <Pagination page={data.page} totalPages={data.totalPages} onPageChange={setPage} />
          </div>
        ) : null}

        {isFetching && !isLoading ? (
          <div className="mt-3 flex items-center justify-center gap-2 text-xs text-text-secondary">
            <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            Updating…
          </div>
        ) : null}
      </div>

      {/* ============ RIGHT RAIL (xl+) ============ */}
      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
          {/* Quick action */}
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
              See something to report?
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-text-secondary">
              Help your barangay by reporting issues you notice nearby.
            </p>
            <a
              href="/reports/new"
              className="mt-4 flex w-full items-center justify-center rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover"
            >
              Submit a report
            </a>
          </div>

          {/* Community pulse */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Community pulse
            </h3>
            <div className="mt-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Reports this week</span>
                <span className="text-sm font-semibold text-text-primary">24</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Verified</span>
                <span className="text-sm font-semibold text-status-verified">18</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-text-secondary">Resolved</span>
                <span className="text-sm font-semibold text-status-resolved">11</span>
              </div>
            </div>
          </div>

          {/* How it works */}
          <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              How it works
            </h3>
            <ol className="mt-4 space-y-4">
              {[
                { n: "1", t: "Report", d: "Submit an issue with details." },
                { n: "2", t: "Verify", d: "Validators confirm it's real." },
                { n: "3", t: "Resolve", d: "Staff act and update status." },
              ].map((s) => (
                <li key={s.n} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-xs font-bold text-primary">
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary">{s.t}</div>
                    <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {s.d}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
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

export default FeedPage;