import type { ReportComment } from "../types";

type Props = {
  comments: ReportComment[];
};

const CommentList = ({ comments }: Props) => {
  if (!comments.length) {
    return (
      <div className="rounded-lg border border-border bg-background p-3 text-sm text-text-secondary">
        No comments yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c.id} className="rounded-lg border border-border bg-surface p-3">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="truncate text-sm font-medium text-text-primary">{c.user.name}</div>
              <div className="text-xs text-text-secondary">{c.user.role?.name}</div>
            </div>
            <div className="text-xs text-text-secondary">
              {new Date(c.createdAt).toLocaleString()}
            </div>
          </div>

          <div className="mt-2 text-sm text-text-secondary">{c.comment}</div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;