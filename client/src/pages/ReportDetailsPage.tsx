import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../stores/authStore";
import { getInitials } from "../lib/helper/getInitials";

import useReportDetailQuery from "../features/reports/hooks/useReportDetailQuery";
import useReportCommentsQuery from "../features/reports/hooks/useReportCommentsQuery";
import useAddCommentMutation from "../features/reports/hooks/useAddCommentQuery";
import useReportHistoryQuery from "../features/reports/hooks/useReportHistoryQuery";

import { getCategoryLabel } from "../features/reports/constants";
import StatusBadge from "../features/reports/components/StatusBadge";
import CommentList from "../features/reports/components/CommentList";
import CommentForm from "../features/reports/components/CommentForm";
import HistoryTimeline from "../features/reports/components/HistoryTimeline";
import VerificationPanel from "../features/verifications/components/VerificationPanel";
import StaffActionPanel from "../features/staff/components/StaffActionPanel";
import ReportPhotos from "../features/reports/components/ReportPhotos";

const ReportDetailPage = () => {
  const { id = "" } = useParams();
  const navigate = useNavigate();

  const me = useAuthStore((s) => s.user);
  const permissions = useAuthStore((s) => s.permissions);

  const detailQuery = useReportDetailQuery(id);
  const commentsQuery = useReportCommentsQuery(id);
  const addCommentMutation = useAddCommentMutation(id);

  const report = detailQuery.data;

  const canComment = permissions.includes("report:comment");

  const canReadHistory = useMemo(() => {
    if (!report) return false;
    if (permissions.includes("history:read")) return true;
    if (permissions.includes("history:read:own") && me?.id && report.reporterId === me.id) return true;
    return false;
  }, [permissions, report, me?.id]);

  const historyQuery = useReportHistoryQuery(id, canReadHistory);

  const openMapUrl = useMemo(() => {
    if (!report) return null;
    const lat = report.latitude;
    const lng = report.longitude;
    return `https://www.openstreetmap.org/?mlat=${encodeURIComponent(lat)}&mlon=${encodeURIComponent(
      lng,
    )}#map=18/${encodeURIComponent(lat)}/${encodeURIComponent(lng)}`;
  }, [report]);

  if (detailQuery.isLoading) {
    return (
      <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
        <div className="min-w-0 space-y-6">
          <div className="animate-pulse">
            <div className="h-3 w-16 rounded bg-surface-sunken" />
            <div className="mt-4 flex gap-2">
              <div className="h-6 w-24 rounded-full bg-surface-sunken" />
              <div className="h-6 w-20 rounded-full bg-surface-sunken" />
            </div>
            <div className="mt-4 h-8 w-3/4 rounded bg-surface-sunken" />
            <div className="mt-3 h-3 w-1/2 rounded bg-surface-sunken" />
          </div>

          <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="h-3 w-24 rounded bg-surface-sunken" />
            <div className="mt-4 h-3 w-full rounded bg-surface-sunken" />
            <div className="mt-2 h-3 w-5/6 rounded bg-surface-sunken" />
            <div className="mt-2 h-3 w-4/6 rounded bg-surface-sunken" />
          </div>

          <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
            <div className="h-3 w-20 rounded bg-surface-sunken" />
            <div className="mt-4 space-y-3">
              <div className="h-3 w-full rounded bg-surface-sunken" />
              <div className="h-3 w-4/6 rounded bg-surface-sunken" />
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4 xl:mt-0">
          <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="h-3 w-24 rounded bg-surface-sunken" />
            <div className="mt-4 h-9 w-full rounded-lg bg-surface-sunken" />
          </div>
          <div className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card">
            <div className="h-3 w-16 rounded bg-surface-sunken" />
            <div className="mt-4 h-8 w-32 rounded-lg bg-surface-sunken" />
          </div>
        </div>
      </div>
    );
  }

  if (detailQuery.error) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
        <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
          !
        </span>
        <span className="leading-relaxed">{detailQuery.error.message}</span>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-12 text-center">
        <div className="text-sm font-semibold text-text-primary">
          Report not found
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          It may have been removed or you don't have access.
        </div>
      </div>
    );
  }

  const reporterPhoto = report.reporter?.profile?.avatarUrl ?? null;
  const reporterInitials = getInitials(report.reporter?.name);

  return (
    <div className="xl:grid xl:grid-cols-[minmax(0,1fr)_22rem] xl:gap-8">
      <div className="min-w-0 space-y-6">
        <div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="group -ml-1.5 inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
          >
            <span className="transition-transform group-hover:-translate-x-0.5">
              ←
            </span>
            Back
          </button>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                {getCategoryLabel(report.category)}
              </span>
            </div>
            <StatusBadge status={report.status} />
          </div>

          <h1 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
            {report.title}
          </h1>

          <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
            <span className="inline-flex items-center gap-2">
              {reporterPhoto ? (
                <span className="block h-6 w-6 shrink-0 overflow-hidden rounded-full border border-border bg-surface-sunken">
                  <img
                    src={reporterPhoto}
                    alt=""
                    className="h-full w-full object-cover"
                    loading="lazy"
                    decoding="async"
                    draggable={false}
                  />
                </span>
              ) : (
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                  {reporterInitials}
                </span>
              )}
              <span className="font-medium text-text-primary">
                {report.reporter?.name}
              </span>
            </span>
            <span className="text-text-secondary/50">·</span>
            <span>{new Date(report.createdAt).toLocaleString()}</span>
          </div>
        </div>

        <ReportPhotos title={report.title} photos={report.photos ?? []} />

        <div className="rounded-2xl border border-border bg-surface shadow-card">
          <div className="p-5 sm:p-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Description
            </div>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
              {report.description}
            </p>
          </div>
        </div>
      </div>

      <aside className="mt-6 xl:row-span-3 xl:mt-0 xl:self-start">
        <div className="space-y-4 xl:sticky xl:top-24">
          <VerificationPanel reportId={report.id} status={report.status} />
          <StaffActionPanel report={report} />

          <div className="rounded-2xl border border-border bg-surface shadow-card">
            <div className="p-5">
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Location
              </div>
              <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-surface-sunken px-2.5 py-1">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="font-mono text-xs text-text-secondary">
                  {report.latitude}, {report.longitude}
                </span>
              </div>

              {openMapUrl ? (
                <a
                  href={openMapUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 flex w-full items-center justify-center rounded-xl border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-light hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
                >
                  Open in map
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </aside>

      <section className="mt-6 min-w-0 space-y-4 xl:col-start-1 xl:mt-0">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-text-primary">
            Comments
          </h2>
          <p className="mt-1 text-xs text-text-secondary">
            Anyone with access can comment.
          </p>
        </div>

        {commentsQuery.error ? (
          <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">{commentsQuery.error.message}</span>
          </div>
        ) : null}

        {commentsQuery.isLoading ? (
          <div className="space-y-5 border-y border-border py-5">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="flex gap-3">
                <div className="h-8 w-8 shrink-0 animate-pulse rounded-full bg-surface-sunken" />
                <div className="flex-1">
                  <div className="h-3 w-32 animate-pulse rounded bg-surface-sunken" />
                  <div className="mt-2 h-3 w-full animate-pulse rounded bg-surface-sunken" />
                  <div className="mt-1.5 h-3 w-4/6 animate-pulse rounded bg-surface-sunken" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <CommentList comments={commentsQuery.data ?? []} />
        )}

        <CommentForm
          canComment={canComment}
          isPending={addCommentMutation.isPending}
          onSubmit={async (text) => {
            await addCommentMutation.mutateAsync({ comment: text });
          }}
        />

        {addCommentMutation.error ? (
          <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
            <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
              !
            </span>
            <span className="leading-relaxed">
              {addCommentMutation.error.message}
            </span>
          </div>
        ) : null}
      </section>

      {canReadHistory ? (
        <section className="mt-6 min-w-0 space-y-4 xl:col-start-1 xl:mt-0">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              History
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Status changes and remarks.
            </p>
          </div>

          {historyQuery.error ? (
            <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
                !
              </span>
              <span className="leading-relaxed">{historyQuery.error.message}</span>
            </div>
          ) : null}

          {historyQuery.isLoading ? (
            <div className="space-y-5 border-y border-border py-5">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-3">
                  <div className="h-6 w-6 shrink-0 animate-pulse rounded-full bg-surface-sunken" />
                  <div className="flex-1">
                    <div className="h-3 w-32 animate-pulse rounded bg-surface-sunken" />
                    <div className="mt-1.5 h-2.5 w-48 animate-pulse rounded bg-surface-sunken" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <HistoryTimeline items={historyQuery.data ?? []} />
          )}
        </section>
      ) : null}
    </div>
  );
};

export default ReportDetailPage;