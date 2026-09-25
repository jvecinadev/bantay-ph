import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";

import useStaffDashboardQuery from "../features/dashboard/staff/hooks/useStaffDashboardQuery";
import StatCard from "../features/dashboard/staff/components/StatCard";
import Section from "../features/dashboard/staff/components/Section";
import UnassignedVerifiedPreview from "../features/dashboard/staff/components/UnassignedVerifiedPreview";
import SkeletonCard from "../shared/ui/SkeletonCard"

const getErrorMessage = (err: unknown) => {
  if (!err) return "Something went wrong.";
  if (typeof err === "string") return err;
  if (typeof err === "object" && "message" in err) {
    const msg = (err as { message?: unknown }).message;
    if (typeof msg === "string" && msg.trim()) return msg;
  }
  return "Something went wrong.";
};


const StaffDashboardSkeleton = () => {
  return (
    <div className="space-y-6">
      <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
        <div className="h-3 w-40 rounded bg-surface-sunken" />
        <div className="mt-3 h-6 w-2/3 rounded bg-surface-sunken" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
        <SkeletonCard />
      </div>
    </div>
  );
};

const ErrorState = ({ message, onRetry }: { message: string; onRetry: () => void }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
          !
        </span>
        <span className="leading-relaxed">{message}</span>
      </div>

      <button
        type="button"
        onClick={onRetry}
        className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
      >
        Retry
      </button>
    </div>
  );
};

const StaffDashboardPage = () => {
  const q = useStaffDashboardQuery();

  if (q.status === "pending") return <StaffDashboardSkeleton />;

  if (q.status === "error") {
    return <ErrorState message={getErrorMessage(q.error)} onRetry={() => q.refetch()} />;
  }

  const d = q.data;

  const lastUpdated = new Date(d.generatedAt).toLocaleString();
  const oldest = d.unassignedVerifiedOldestCreatedAt
    ? new Date(d.unassignedVerifiedOldestCreatedAt).toLocaleDateString()
    : null;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Staff Dashboard
            </h1>
            <div className="mt-1 text-sm text-text-secondary">Last updated: {lastUpdated}</div>
          </div>

          <button
            type="button"
            onClick={() => q.refetch()}
            disabled={q.isFetching}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface shadow-card hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {q.isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Unassigned verified"
          value={d.unassignedVerifiedCount}
          sub={oldest ? `Oldest: ${oldest}` : undefined}
        />
        <StatCard
          label="Overdue > 48h"
          value={d.unassignedVerifiedOverdue48hCount}
          sub="From unassigned verified"
        />
        <StatCard
          label="My active"
          value={d.myActiveCount}
          sub={`Overdue: ${d.myOverdue48hCount}`}
        />
        <StatCard label="Resolved (7 days)" value={d.myResolvedLast7Days} sub="My throughput" />
      </div>

      <Section
        title="Unassigned verified (preview)"
        right={
          <Link to={ROUTES.staffQueue} className="text-sm font-semibold text-primary hover:underline">
            Open Staff Queue
          </Link>
        }
      >
        <UnassignedVerifiedPreview items={d.unassignedVerifiedPreview ?? []} />
      </Section>
    </div>
  );
};

export default StaffDashboardPage;