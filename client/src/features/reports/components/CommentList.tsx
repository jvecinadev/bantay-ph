import { Link } from "react-router-dom";
import type { ReportComment } from "../types";
import { getInitials } from "../../../lib/helper/getInitials";

type Props = {
  comments: ReportComment[];
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
        const avatarUrl = c.user.profile?.avatarUrl ?? null;
        const userId = c.user.id ?? null;
        const hasProfile = !!userId;
        const profilePath = hasProfile ? `/user/${userId}/profile` : "";
        const displayName = c.user.name ?? "Unknown";

        const avatar = avatarUrl ? (
          <img
            src={avatarUrl}
            alt=""
            className="h-full w-full object-cover"
            loading="lazy"
            decoding="async"
            draggable={false}
          />
        ) : (
          <span
            className={`flex h-full w-full items-center justify-center text-[11px] font-bold ${tint}`}
            aria-hidden="true"
          >
            {initials}
          </span>
        );

        return (
          <article key={c.id} className="flex items-start gap-3 py-4">
            {hasProfile ? (
              <Link
                to={profilePath}
                aria-label={`View ${displayName}'s profile`}
                className="block h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-surface-sunken transition-opacity hover:opacity-80 focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
              >
                {avatar}
              </Link>
            ) : (
              <span className="block h-8 w-8 shrink-0 overflow-hidden rounded-full border border-border bg-surface-sunken">
                {avatar}
              </span>
            )}

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5 text-xs">
                {hasProfile ? (
                  <Link
                    to={profilePath}
                    className="font-semibold text-text-primary transition-colors hover:text-primary focus:outline-none focus-visible:underline"
                  >
                    {displayName}
                  </Link>
                ) : (
                  <span className="font-semibold text-text-primary">
                    {displayName}
                  </span>
                )}

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