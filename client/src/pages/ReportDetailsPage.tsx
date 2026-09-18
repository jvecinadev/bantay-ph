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
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
        Loading report…
      </div>
    );
  }

  if (detailQuery.error) {
    return (
      <div className="rounded-lg border border-danger bg-danger-light p-4 text-sm text-danger">
        {detailQuery.error.message}
      </div>
    );
  }

  if (!report) {
    return (
      <div className="rounded-lg border border-border bg-background p-4 text-sm text-text-secondary">
        Report not found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="text-sm text-primary hover:text-primary-dark"
          >
            ← Back
          </button>

          <h1 className="mt-2 text-lg font-semibold text-text-primary">{report.title}</h1>

          <div className="mt-2 flex flex-wrap items-center gap-2">
            <StatusBadge status={report.status} />
            <span className="text-xs text-text-secondary">{getCategoryLabel(report.category)}</span>
          </div>

          <div className="mt-2 text-xs text-text-secondary">
            Reported by <span className="text-text-primary">{report.reporter?.name}</span> •{" "}
            {new Date(report.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-4">
        <div className="text-sm font-medium text-text-primary">Description</div>
        <div className="mt-2 text-sm text-text-secondary">{report.description}</div>

        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-xs text-text-secondary">Latitude</div>
            <div className="mt-1 text-sm text-text-primary">{report.latitude}</div>
          </div>
          <div className="rounded-lg border border-border bg-background p-3">
            <div className="text-xs text-text-secondary">Longitude</div>
            <div className="mt-1 text-sm text-text-primary">{report.longitude}</div>
          </div>
        </div>

        {openMapUrl ? (
          <a
            href={openMapUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-4 inline-flex rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary hover:border-primary"
          >
            Open location in map
          </a>
        ) : null}
      </div>

      {/* Comments */}
      <div className="space-y-3">
        <div>
          <div className="text-sm font-semibold text-text-primary">Comments</div>
          <div className="mt-1 text-xs text-text-secondary">
            Anyone with access can comment.
          </div>
        </div>

        {commentsQuery.error ? (
          <div className="rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
            {commentsQuery.error.message}
          </div>
        ) : null}

        {commentsQuery.isLoading ? (
          <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
            Loading comments…
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
          <div className="rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
            {addCommentMutation.error.message}
          </div>
        ) : null}
      </div>

      {/* History */}
      {canReadHistory ? (
        <div className="space-y-3">
          <div>
            <div className="text-sm font-semibold text-text-primary">History</div>
            <div className="mt-1 text-xs text-text-secondary">Status changes and remarks.</div>
          </div>

          {historyQuery.error ? (
            <div className="rounded-lg border border-danger bg-danger-light p-3 text-sm text-danger">
              {historyQuery.error.message}
            </div>
          ) : null}

          {historyQuery.isLoading ? (
            <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
              Loading history…
            </div>
          ) : (
            <HistoryTimeline items={historyQuery.data ?? []} />
          )}
        </div>
      ) : null}
    </div>
  );
};

export default ReportDetailPage;