import { Link } from "react-router-dom";
import { ROUTES } from "../app/router/routes";
import { getErrorMessage } from "../lib/helper/getErrorMessage";

import useAdminDashboardQuery from "../features/dashboard/admin/hooks/useAdminDashboardQuery";
import StatCard from "../features/dashboard/admin/components/StatCard";
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
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-3 w-40 rounded bg-surface-sunken" />
          <div className="mt-3 h-6 w-2/3 rounded bg-surface-sunken" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="h-3 w-28 rounded bg-surface-sunken" />
              <div className="mt-3 h-7 w-16 rounded bg-surface-sunken" />
              <div className="mt-2 h-3 w-32 rounded bg-surface-sunken" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (q.status === "error") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{getErrorMessage(q.error)}</span>
        </div>

        <button
          type="button"
          onClick={() => q.refetch()}
          className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          Retry
        </button>
      </div>
    );
  }

  const d = q.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Admin Dashboard
            </h1>
            <div className="mt-1 text-sm text-text-secondary">
              Last updated: {new Date(d.generatedAt).toLocaleString()}
            </div>
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

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total users" value={d.users.totalUsers} sub={`${d.users.activeUsers} active`} />
        <StatCard label="Total reports" value={d.reports.totalReports} sub={`${d.reports.reportsLast7Days} last 7 days`} />
        <StatCard label="Verified unassigned" value={d.reports.verifiedUnassignedCount} sub={`Overdue > 48h: ${d.reports.verifiedUnassignedOverdue48hCount}`} />
        <StatCard label="Resolved (7 days)" value={d.throughput.resolvedLast7Days} sub="Throughput" />

        <StatCard label="Pending verification" value={d.verification.pendingReportedCount} sub="Status: REPORTED" />
        <StatCard label="Under verification" value={d.verification.underVerificationCount} sub="Status: UNDER_VERIFICATION" />
        <StatCard label="Staff active assigned" value={d.staffWorkload.activeAssignedCount} sub={`SLA: ${d.staffWorkload.slaHours}h`} />
        <StatCard label="Staff overdue > 48h" value={d.staffWorkload.overdue48hAssignedCount} />
      </div>

      {/* Users + Staff workload */}
      <div className="grid gap-6 lg:grid-cols-2">
        <UsersByRoleCard
          total={d.users.totalUsers}
          active={d.users.activeUsers}
          inactive={d.users.inactiveUsers}
          roles={d.users.usersByRole ?? []}
        />
        <StaffWorkloadCard staffWorkload={d.staffWorkload} />
      </div>

      {/* Distributions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <KeyValueBarsCard title="Reports by status" data={d.reports.reportsByStatus} />
        <KeyValueBarsCard title="Reports by category" data={d.reports.reportsByCategory} />
      </div>

      {/* Verification outcomes */}
      <Section title="Verification outcomes (last 7 days)">
        <div className="grid gap-4 sm:grid-cols-3">
          <StatCard label="Verified" value={d.verification.outcomesLast7Days.VERIFIED} />
          <StatCard label="Rejected" value={d.verification.outcomesLast7Days.REJECTED} />
          <StatCard label="Duplicate" value={d.verification.outcomesLast7Days.DUPLICATE} />
        </div>
      </Section>

      {/* Previews */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Section
          title="Recent reports"
          right={<Link to={ROUTES.feed} className="text-sm font-semibold text-primary hover:underline">Feed</Link>}
        >
          <RecentReportsCard items={d.previews?.recentReports ?? []} />
        </Section>

        <Section
          title="Recent verifications"
          right={<Link to={ROUTES.validatorQueue} className="text-sm font-semibold text-primary hover:underline">Queue</Link>}
        >
          <RecentVerificationsCard items={d.previews?.recentVerifications ?? []} />
        </Section>

        <Section
          title="Recent audit logs"
          right={<Link to={ROUTES.adminAuditLogs} className="text-sm font-semibold text-primary hover:underline">View all</Link>}
        >
          <RecentAuditLogsCard items={d.previews?.recentAuditLogs ?? []} />
        </Section>
      </div>
    </div>
  );
};

export default AdminDashboardPage;