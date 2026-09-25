import { useState } from "react";
import useFeedReportsQuery from "../features/reports/hooks/useFeedReportsQuery";
import { CATEGORY_OPTIONS } from "../features/reports/constants";
import type { ReportCategory } from "../features/reports/types";
import Pagination from "../shared/ui/Pagination";
import FeedReportCard from "../features/reports/components/FeedReportCard";

const FeedPage = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState<ReportCategory | "">("");
  const limit = 10;

  const { data, isLoading, error } = useFeedReportsQuery({ page, limit, category });

  const chipClass = (active: boolean) =>
    [
      "inline-flex shrink-0 items-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap",
      active
        ? "border-primary bg-primary text-surface"
        : "border-border-strong bg-surface text-text-secondary hover:border-text-secondary/40 hover:text-text-primary",
    ].join(" ");

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_20rem] xl:gap-8">
      <div className="min-w-0">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Feed
            </h1>
            <p className="mt-1.5 text-sm text-text-secondary">
              Verified and above reports from the community.
            </p>
          </div>

          <a
            href="/reports/new"
            className="hidden shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3.5 py-2 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 sm:inline-flex"
          >
            <span className="text-base leading-none">+</span>
            New report
          </a>
        </div>

        <div className="-mx-4 mt-5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:overflow-visible sm:px-0">
          <div className="flex gap-2 sm:flex-wrap">
            <button
              type="button"
              onClick={() => {
                setPage(1);
                setCategory("");
              }}
              className={chipClass(category === "")}
            >
              All
            </button>

            {CATEGORY_OPTIONS.map((c) => (
              <button
                key={c.value}
                type="button"
                onClick={() => {
                  setPage(1);
                  setCategory(c.value as ReportCategory);
                }}
                className={chipClass(category === c.value)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {error ? (
          <div className="mt-5 flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{error.message}</span>
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          {isLoading ? (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6"
                >
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 shrink-0 rounded-full bg-surface-sunken" />
                    <div className="flex-1">
                      <div className="h-3 w-32 rounded bg-surface-sunken" />
                      <div className="mt-2 h-2.5 w-20 rounded bg-surface-sunken" />
                    </div>
                    <div className="h-6 w-16 rounded-full bg-surface-sunken" />
                  </div>
                  <div className="mt-4 h-5 w-3/4 rounded bg-surface-sunken" />
                  <div className="mt-3 h-3 w-full rounded bg-surface-sunken" />
                  <div className="mt-2 h-3 w-4/6 rounded bg-surface-sunken" />
                </div>
              ))}
            </>
          ) : data?.reports?.length ? (
            data.reports.map((r) => (
              <FeedReportCard
                key={r.id}
                id={r.id}
                title={r.title}
                description={r.description}
                createdAt={r.createdAt}
                status={r.status}
                reporterName={r.reporter?.name ?? null}
                category={r.category}
                photos={(r.photos ?? []).map((p) => p.url)}
              />
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-12 text-center">
              <div className="text-sm font-semibold text-text-primary">
                No reports found
              </div>
              <div className="mt-1 text-xs text-text-secondary">
                {category
                  ? "Nothing in this category yet. Try another one."
                  : "Reports will show up here once they're verified."}
              </div>
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

        <a
          href="/reports/new"
          aria-label="New report"
          className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl font-light leading-none text-surface shadow-popover transition-transform hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 sm:hidden"
        >
          +
        </a>
      </div>

      <aside className="hidden xl:block">
        <div className="sticky top-24 space-y-4">
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
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[11px] font-bold text-primary">
                    {s.n}
                  </span>
                  <div className="min-w-0">
                    <div className="text-sm font-semibold text-text-primary">
                      {s.t}
                    </div>
                    <div className="mt-0.5 text-xs leading-relaxed text-text-secondary">
                      {s.d}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </div>

          <div className="rounded-2xl border border-border bg-surface-sunken p-5">
            <p className="text-xs leading-relaxed text-text-secondary">
              Only reports that have been verified by a validator appear on
              the public feed.
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

export default FeedPage;