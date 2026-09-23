import type { ReportComment } from "../types";

type Props = {
  comments: ReportComment[];
};

const getInitials = (name: string) => {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const AVATAR_TINTS = [
  "bg-primary-light text-primary",
  "bg-accent-light text-accent",
  "bg-success-light text-success",
  "bg-danger-light text-danger",
  "bg-status-assigned-bg text-status-assigned",
  "bg-status-in-progress-bg text-status-in-progress",
];

const getTint = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_TINTS[hash % AVATAR_TINTS.length];
};

const CommentList = ({ comments }: Props) => {
  if (!comments.length) {
    return (
      <p className="py-6 text-sm text-text-secondary">
        No comments yet. Be the first to share an update.
      </p>
    );
  }

  return (
    <div className="divide-y divide-border border-y border-border">
      {comments.map((c) => {
        const tint = getTint(c.user.name);
        const initials = getInitials(c.user.name);

        return (
          <article key={c.id} className="flex items-start gap-3 py-4">
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${tint}`}
              aria-hidden="true"
            >
              {initials}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                <span className="font-semibold text-text-primary">
                  {c.user.name}
                </span>
                {c.user.role?.name ? (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    {c.user.role.name}
                  </span>
                ) : null}
                <span className="text-text-secondary/50">·</span>
                <span className="text-text-secondary">
                  {new Date(c.createdAt).toLocaleString()}
                </span>
              </div>

              <p className="mt-1.5 whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                {c.comment}
              </p>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CommentList;