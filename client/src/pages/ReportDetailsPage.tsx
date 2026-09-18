import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuthStore from "../stores/authStore";

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
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-3 w-16 rounded bg-surface-sunken" />
          <div className="mt-3 h-7 w-3/4 rounded bg-surface-sunken" />
          <div className="mt-3 flex gap-2">
            <div className="h-6 w-20 rounded-full bg-surface-sunken" />
            <div className="h-6 w-24 rounded-full bg-surface-sunken" />
          </div>
          <div className="mt-3 h-3 w-1/2 rounded bg-surface-sunken" />
        </div>
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-3 w-24 rounded bg-surface-sunken" />
          <div className="mt-4 h-3 w-full rounded bg-surface-sunken" />
          <div className="mt-2 h-3 w-5/6 rounded bg-surface-sunken" />
          <div className="mt-2 h-3 w-4/6 rounded bg-surface-sunken" />
        </div>
        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="h-3 w-20 rounded bg-surface-sunken" />
          <div className="mt-4 h-8 w-40 rounded-lg bg-surface-sunken" />
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
          Report not found
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          It may have been removed or you don't have access.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* ============ HEADER ============ */}
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="group inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary transition-colors hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 rounded-md px-1 py-0.5 -ml-1"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-0.5"
          >
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-surface-sunken px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
            <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
              {getCategoryLabel(report.category)}
            </span>
          </div>
          <StatusBadge status={report.status} />
        </div>

        <h1 className="mt-3 text-2xl font-bold leading-tight tracking-tight text-text-primary sm:text-3xl">
          {report.title}
        </h1>

        <div className="mt-2.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="shrink-0 opacity-70"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            <span className="font-medium text-text-primary">
              {report.reporter?.name}
            </span>
          </span>
          <span className="text-text-secondary/50">•</span>
          <span>{new Date(report.createdAt).toLocaleString()}</span>
        </div>
      </div>

      {/* ============ DESCRIPTION + LOCATION ============ */}
      <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
        {/* Description section */}
        <div className="p-5 sm:p-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Description
          </div>
          <p className="mt-3 text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
            {report.description}
          </p>
        </div>

        {/* Location section */}
        <div className="border-t border-border p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Location
              </div>
              <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-surface-sunken px-2.5 py-1">
                <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                <span className="font-mono text-xs text-text-secondary">
                  {report.latitude}, {report.longitude}
                </span>
              </div>
            </div>

            {openMapUrl ? (
              <a
                href={openMapUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-xl border border-border-strong bg-surface px-3.5 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:bg-primary-light hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/10"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                  <polyline points="15 3 21 3 21 9" />
                  <line x1="10" y1="14" x2="21" y2="3" />
                </svg>
                Open in map
              </a>
            ) : null}
          </div>
        </div>
      </div>
      <VerificationPanel reportId={report.id} status={report.status} />
      {/* ============ COMMENTS ============ */}
      <section className="space-y-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold tracking-tight text-text-primary">
              Comments
            </h2>
            <p className="mt-1 text-xs text-text-secondary">
              Anyone with access can comment.
            </p>
          </div>
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
          <div className="space-y-3">
            {[...Array(2)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse rounded-2xl border border-border bg-surface p-5 shadow-card"
              >
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-surface-sunken" />
                  <div className="flex-1">
                    <div className="h-3 w-24 rounded bg-surface-sunken" />
                    <div className="mt-1.5 h-2.5 w-16 rounded bg-surface-sunken" />
                  </div>
                </div>
                <div className="mt-3 h-3 w-full rounded bg-surface-sunken" />
                <div className="mt-2 h-3 w-4/6 rounded bg-surface-sunken" />
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
            <span className="leading-relaxed">{addCommentMutation.error.message}</span>
          </div>
        ) : null}
      </section>

      {/* ============ HISTORY ============ */}
      {canReadHistory ? (
        <section className="space-y-4">
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
            <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
              <div className="space-y-5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex gap-3">
                    <div className="h-6 w-6 shrink-0 rounded-full bg-surface-sunken" />
                    <div className="flex-1">
                      <div className="h-3 w-32 rounded bg-surface-sunken" />
                      <div className="mt-1.5 h-2.5 w-48 rounded bg-surface-sunken" />
                    </div>
                  </div>
                ))}
              </div>
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