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
      <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-10 text-center">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-surface shadow-card">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-text-secondary"
          >
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        </div>
        <div className="mt-3 text-sm font-semibold text-text-primary">
          No comments yet
        </div>
        <div className="mt-1 text-xs text-text-secondary">
          Be the first to share an update or ask a question.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => {
        const tint = getTint(c.user.name);
        const initials = getInitials(c.user.name);

        return (
          <article
            key={c.id}
            className="group rounded-2xl border border-border bg-surface p-5 shadow-card transition-colors hover:border-border-strong"
          >
            <div className="flex items-start gap-3">
              {/* Avatar with initials */}
              <div
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${tint}`}
                aria-hidden="true"
              >
                {initials}
              </div>

              {/* Main column */}
              <div className="min-w-0 flex-1">
                {/* Header row: name + role + timestamp */}
                <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="truncate text-sm font-semibold text-text-primary">
                    {c.user.name}
                  </span>

                  {c.user.role?.name ? (
                    <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                      {c.user.role.name}
                    </span>
                  ) : null}

                  <span className="text-text-secondary/50">·</span>

                  <span className="text-xs text-text-secondary">
                    {new Date(c.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Body */}
                <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-text-primary">
                  {c.comment}
                </p>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
};

export default CommentList;