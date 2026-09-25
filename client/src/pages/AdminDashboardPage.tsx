import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { getErrorMessage } from "../lib/helper/getErrorMessage";

import useAdminDashboardQuery from "../features/dashboard/admin/hooks/useAdminDashboardQuery";
import Section from "../features/dashboard/admin/components/Section";
import KeyValueBarsCard from "../features/dashboard/admin/components/KeyValueBarsCard";
import UsersByRoleCard from "../features/dashboard/admin/components/UsersByRoleCard";
import StaffWorkloadCard from "../features/dashboard/admin/components/StaffWorkloadCard";
import RecentReportsCard from "../features/dashboard/admin/components/RecentReportCard";
import RecentVerificationsCard from "../features/dashboard/admin/components/RecentVerificationCard";
import RecentAuditLogsCard from "../features/dashboard/admin/components/RecentAuditLogsCard";

const AdminDashboardPage = () => {
  const q = useAdminDashboardQuery();

  if (q.status === "pending") {
    return (
      <div className="space-y-6">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 animate-pulse rounded bg-surface-sunken" />
            <div className="h-3 w-48 animate-pulse rounded bg-surface-sunken" />
          </div>
          <div className="h-9 w-24 animate-pulse rounded-lg bg-surface-sunken" />
        </header>

        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card sm:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse bg-surface p-4 sm:p-5">
              <div className="h-3 w-20 rounded bg-surface-sunken" />
              <div className="mt-3 h-7 w-12 rounded bg-surface-sunken" />
              <div className="mt-2 h-3 w-24 rounded bg-surface-sunken" />
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
          <div className="h-72 animate-pulse rounded-2xl border border-border bg-surface shadow-card" />
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

  const kpis = [
    { label: "Total users", value: d.users.totalUsers, sub: `${d.users.activeUsers} active` },
    { label: "Total reports", value: d.reports.totalReports, sub: `${d.reports.reportsLast7Days} this week` },
    { label: "Verified unassigned", value: d.reports.verifiedUnassignedCount, sub: `${d.reports.verifiedUnassignedOverdue48hCount} overdue 48h+` },
    { label: "Resolved · 7d", value: d.throughput.resolvedLast7Days, sub: "Throughput" },
    { label: "Pending verification", value: d.verification.pendingReportedCount, sub: "Awaiting validator" },
    { label: "Under verification", value: d.verification.underVerificationCount, sub: "In review" },
    { label: "Staff active", value: d.staffWorkload.activeAssignedCount, sub: `SLA ${d.staffWorkload.slaHours}h` },
    { label: "Staff overdue · 48h", value: d.staffWorkload.overdue48hAssignedCount, sub: "Needs attention" },
  ];

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Admin Dashboard
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
        <UsersByRoleCard
          total={d.users.totalUsers}
          active={d.users.activeUsers}
          inactive={d.users.inactiveUsers}
          roles={d.users.usersByRole ?? []}
        />
        <StaffWorkloadCard staffWorkload={d.staffWorkload} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <KeyValueBarsCard title="Reports by status" data={d.reports.reportsByStatus} />
        <KeyValueBarsCard title="Reports by category" data={d.reports.reportsByCategory} />
      </div>

      <section className="space-y-4">
        <header>
          <h2 className="text-base font-semibold tracking-tight text-text-primary">
            Verification outcomes
          </h2>
          <p className="mt-1 text-xs text-text-secondary">Last 7 days</p>
        </header>

        <div className="grid grid-cols-3 gap-px overflow-hidden rounded-2xl border border-border bg-border shadow-card">
          <div className="bg-surface p-4 sm:p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Verified
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-status-verified">
              {d.verification.outcomesLast7Days.VERIFIED}
            </div>
          </div>
          <div className="bg-surface p-4 sm:p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Rejected
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-status-rejected">
              {d.verification.outcomesLast7Days.REJECTED}
            </div>
          </div>
          <div className="bg-surface p-4 sm:p-5">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              Duplicate
            </div>
            <div className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-text-secondary">
              {d.verification.outcomesLast7Days.DUPLICATE}
            </div>
          </div>
        </div>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Recent reports"
          right={
            <Link to={ROUTES.feed} className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
              Feed →
            </Link>
          }
        >
          <RecentReportsCard items={d.previews?.recentReports ?? []} />
        </Section>

        <Section
          title="Recent verifications"
          right={
            <Link to={ROUTES.validatorQueue} className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
              Queue →
            </Link>
          }
        >
          <RecentVerificationsCard items={d.previews?.recentVerifications ?? []} />
        </Section>

        <Section
          title="Recent audit logs"
          right={
            <Link to={ROUTES.adminAuditLogs} className="text-sm font-semibold text-primary transition-colors hover:text-primary-dark">
              View all →
            </Link>
          }
        >
          <RecentAuditLogsCard items={d.previews?.recentAuditLogs ?? []} />
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;