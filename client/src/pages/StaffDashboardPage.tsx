import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { getErrorMessage } from "../lib/helper/getErrorMessage";

import useStaffDashboardQuery from "../features/dashboard/staff/hooks/useStaffDashboardQuery";
import Section from "../features/dashboard/staff/components/Section";
import UnassignedVerifiedPreview from "../features/dashboard/staff/components/UnassignedVerifiedPreview";
import UnassignedByCategoryCard from "../features/dashboard/staff/components/UnassignedByCategoryCard";
import MyActiveReportsCard from "../features/dashboard/staff/components/MyActiveReportsCard";

const StaffDashboardPage = () => {
  const q = useStaffDashboardQuery();

  if (q.status === "pending") {
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-48 animate-pulse rounded bg-surface-sunken" />
            <div className="h-3 w-44 animate-pulse rounded bg-surface-sunken" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-surface-sunken" />
        </div>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card sm:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="animate-pulse bg-surface p-4 sm:p-5">
              <div className="h-3 w-20 rounded bg-surface-sunken" />
              <div className="mt-3 h-7 w-12 rounded bg-surface-sunken" />
              <div className="mt-2 h-3 w-24 rounded bg-surface-sunken" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
          <div className="h-64 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
        </div>
      </div>
    );
  }

  if (q.status === "error") {
    return (
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{getErrorMessage(q.error)}</span>
        </div>

        <button
          type="button"
          onClick={() => q.refetch()}
          className="inline-flex items-center justify-center rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = q.data;
  const assigned = d.myAssignedCounts?.ASSIGNED ?? 0;
  const inProgress = d.myAssignedCounts?.IN_PROGRESS ?? 0;

  const kpis = [
    {
      label: "Unassigned verified",
      value: d.unassignedVerifiedCount,
      sub: d.unassignedVerifiedOldestCreatedAt
        ? `Oldest · ${new Date(d.unassignedVerifiedOldestCreatedAt).toLocaleDateString()}`
        : "Nothing pending",
    },
    {
      label: "Overdue · 48h+",
      value: d.unassignedVerifiedOverdue48hCount,
      sub: "From unassigned verified",
    },
    {
      label: "My active",
      value: d.myActiveCount,
      sub: `${assigned} assigned · ${inProgress} in progress`,
    },
    {
      label: "Resolved · 7d",
      value: d.myResolvedLast7Days,
      sub: "My throughput",
    },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Staff Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-text-secondary">
            Last updated {new Date(d.generatedAt).toLocaleString()}
          </p>
        </div>

        <button
          type="button"
          onClick={() => q.refetch()}
          disabled={q.isFetching}
          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {q.isFetching ? "Refreshing…" : "Refresh"}
        </button>
      </header>

      <section className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card sm:grid-cols-4">
        {kpis.map((kpi) => (
          <div key={kpi.label} className="bg-surface p-4 sm:p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {kpi.label}
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-text-primary sm:text-3xl">
              {kpi.value}
            </div>
            <div className="mt-1.5 text-xs text-text-secondary">
              {kpi.sub}
            </div>
          </div>
        ))}
      </section>

      <div className="grid gap-6 lg:grid-cols-2">
        <UnassignedByCategoryCard data={d.unassignedVerifiedByCategory ?? {}} />
        <MyActiveReportsCard items={d.myActiveReports ?? []} />
      </div>

      <Section
        title="Unassigned verified"
        right={
          <Link
            to={ROUTES.staffQueue}
            className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            Open Staff Queue →
          </Link>
        }
      >
        <UnassignedVerifiedPreview items={d.unassignedVerifiedPreview ?? []} />
      </Section>
    </div>
  );
};

export default StaffDashboardPage;