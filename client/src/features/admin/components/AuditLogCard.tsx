import type { AuditLog } from "../types";
import { getInitials } from "../../../lib/helper/getInitials";

type Props = {
  log: AuditLog;
};

const safeParseDetails = (details: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(details);
    if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
    return null;
  } catch {
    return null;
  }
};

// Color-code the action by its verb prefix, so similar actions look similar.
const getActionTint = (action: string) => {
  const a = action.toUpperCase();
  if (a.includes("DELETE") || a.includes("REMOVE") || a.includes("REJECT")) {
    return "bg-danger-light text-danger";
  }
  if (a.includes("CREATE") || a.includes("ADD") || a.includes("APPROVE")) {
    return "bg-success-light text-success";
  }
  if (a.includes("UPDATE") || a.includes("EDIT") || a.includes("CHANGE")) {
    return "bg-status-verified-bg text-status-verified";
  }
  if (a.includes("LOGIN") || a.includes("LOGOUT") || a.includes("AUTH")) {
    return "bg-status-assigned-bg text-status-assigned";
  }
  return "bg-surface-sunken text-text-secondary";
};

const AuditLogCard = ({ log }: Props) => {
  const parsed = safeParseDetails(log.details);

  const actionTint = getActionTint(log.action);
  const initials = getInitials(log.user?.name);
  const entryCount = parsed ? Object.keys(parsed).length : 0;

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-colors hover:border-border-strong">
      {/* ============ HEADER ============ */}
      <div className="p-5 sm:p-6">
        <div className="flex items-start gap-4">
          {/* User avatar */}
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-sunken text-xs font-bold text-text-secondary"
            aria-hidden="true"
          >
            {initials}
          </div>

          {/* Main identity block */}
          <div className="min-w-0 flex-1">
            {/* Top row: action pill + timestamp */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-2.5 py-0.5 font-mono text-[11px] font-semibold uppercase tracking-wider",
                  actionTint,
                ].join(" ")}
              >
                {log.action}
              </span>

              <span className="text-xs text-text-secondary">
                {new Date(log.createdAt).toLocaleString()}
              </span>
            </div>

            {/* Entity row */}
            <div className="mt-3 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
              <span className="text-text-secondary/70">on</span>
              <span className="inline-flex items-center rounded-md bg-surface-sunken px-2 py-0.5 font-mono text-[11px] font-medium text-text-secondary">
                {log.entityType}
              </span>
              <span className="font-mono text-[11px] text-text-primary">
                #{log.entityId}
              </span>
            </div>

            {/* Actor row */}
            <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-secondary">
              <span className="text-text-secondary/70">by</span>
              <span className="font-medium text-text-primary">
                {log.user?.name ?? "Unknown"}
              </span>
              {log.user?.role?.name ? (
                <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                  {log.user.role.name}
                </span>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      {/* ============ DETAILS ============ */}
      <div className="border-t border-border bg-surface-sunken/50 p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Details
          </div>
          {entryCount > 0 ? (
            <span className="text-[11px] font-medium text-text-secondary">
              {entryCount} {entryCount === 1 ? "field" : "fields"}
            </span>
          ) : null}
        </div>

        {parsed ? (
          <dl className="mt-3 overflow-hidden rounded-xl border border-border bg-surface">
            {Object.entries(parsed).map(([k, v], idx) => (
              <div
                key={k}
                className={[
                  "grid grid-cols-1 gap-1 px-4 py-2.5 sm:grid-cols-[140px_1fr] sm:gap-3",
                  idx !== 0 ? "border-t border-border" : "",
                ].join(" ")}
              >
                <dt className="font-mono text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
                  {k}
                </dt>
                <dd className="wrap-break-word text-sm text-text-primary">
                  {String(v)}
                </dd>
              </div>
            ))}
          </dl>
        ) : (
          <div className="mt-3 rounded-xl border border-border bg-surface px-4 py-3">
            <p className="whitespace-pre-wrap wrap-break-word text-sm leading-relaxed text-text-primary">
              {log.details}
            </p>
          </div>
        )}
      </div>
    </article>
  );
};

export default AuditLogCard;