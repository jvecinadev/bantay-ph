import { useState } from "react";
import { Link } from "react-router-dom";
import { LuChevronDown } from "react-icons/lu";
import { getInitials } from "../../../lib/helper/getInitials";
import type { AuditLog } from "../types";
import { ACTION_TINTS, getActionKind } from "../constants";

type Props = {
  log: AuditLog;
};

const formatTimestamp = (value: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }),
  };
};

const safeParseDetails = (
  details: string | null,
): Record<string, unknown> | null => {
  if (!details) return null;
  try {
    const parsed = JSON.parse(details);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
    return null;
  } catch {
    return null;
  }
};

const AuditLogRow = ({ log }: Props) => {
  const [open, setOpen] = useState(false);

  const kind = getActionKind(log.action);
  const actionTint = ACTION_TINTS[kind] ?? ACTION_TINTS.default;
  const { date, time } = formatTimestamp(log.createdAt);
  const parsed = safeParseDetails(log.details);
  const detailEntries = parsed ? Object.entries(parsed) : [];
  const hasStructuredDetails = detailEntries.length > 0;
  const hasFallbackText = !hasStructuredDetails && !!log.details;
  const hasDetails = hasStructuredDetails || hasFallbackText;

  const userId = log.user?.id ?? null;
  const hasProfile = !!userId;
  const displayName = log.user?.name ?? "System";
  const initials = getInitials(displayName);

  const toggle = () => {
    if (!hasDetails) return;
    setOpen((v) => !v);
  };

  return (
    <div className="transition-colors hover:bg-surface-sunken/40">
      <div
        role={hasDetails ? "button" : undefined}
        tabIndex={hasDetails ? 0 : undefined}
        onClick={toggle}
        onKeyDown={(e) => {
          if (!hasDetails) return;
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        className={[
          "grid w-full grid-cols-1 gap-3 px-5 py-3.5 text-left focus:outline-none md:grid-cols-[140px_170px_minmax(0,1fr)_200px] md:items-center md:gap-6",
          hasDetails
            ? "cursor-pointer focus-visible:bg-surface-sunken/60"
            : "cursor-default",
        ].join(" ")}
      >
        <div className="flex items-center gap-2">
          {hasDetails ? (
            <LuChevronDown
              size={14}
              className={[
                "shrink-0 text-text-secondary transition-transform duration-200",
                open ? "rotate-180" : "",
              ].join(" ")}
            />
          ) : (
            <span className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          )}
          <span className="min-w-0">
            <span className="block text-xs font-medium tabular-nums text-text-primary">
              {date}
            </span>
            <span className="block text-[11px] tabular-nums text-text-secondary">
              {time}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 md:block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary md:hidden">
            Action
          </span>
          <span
            className={`inline-flex max-w-full items-center truncate rounded-full px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${actionTint}`}
          >
            {log.action}
          </span>
        </div>

        <div className="flex min-w-0 items-center gap-2 md:block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary md:hidden">
            Entity
          </span>
          <span className="min-w-0 truncate text-xs text-text-primary">
            <span className="font-mono">{log.entityType}</span>
            <span className="mx-1.5 text-text-secondary/60">·</span>
            <span className="font-mono text-[11px] text-text-secondary">
              {log.entityId}
            </span>
          </span>
        </div>

        <div className="flex items-center gap-2 md:block">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary md:hidden">
            Actor
          </span>
          {hasProfile ? (
            <Link
              to={`/user/${userId}/profile`}
              onClick={(e) => e.stopPropagation()}
              className="group/actor inline-flex min-w-0 rounded-md focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
            >
              <span className="flex min-w-0 items-center gap-2.5">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-sunken">
                  <span className="text-[10px] font-bold text-text-secondary">
                    {initials}
                  </span>
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-xs font-medium text-text-primary transition-colors group-hover/actor:text-primary">
                    {displayName}
                  </span>
                  {log.user?.role?.name ? (
                    <span className="block truncate text-[10px] uppercase tracking-wider text-text-secondary">
                      {log.user.role.name.replace(/_/g, " ")}
                    </span>
                  ) : null}
                </span>
              </span>
            </Link>
          ) : (
            <span className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-sunken">
                <span className="text-[10px] font-bold text-text-secondary">
                  {initials}
                </span>
              </span>
              <span className="min-w-0">
                <span className="block truncate text-xs font-medium text-text-primary">
                  {displayName}
                </span>
                {log.user?.role?.name ? (
                  <span className="block truncate text-[10px] uppercase tracking-wider text-text-secondary">
                    {log.user.role.name.replace(/_/g, " ")}
                  </span>
                ) : null}
              </span>
            </span>
          )}
        </div>
      </div>

      {open && hasDetails ? (
        <div className="border-t border-border bg-surface-sunken/40 px-5 py-4 md:pl-45">
          <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Details
          </div>

          {hasStructuredDetails ? (
            <dl className="mt-3 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
              {detailEntries.map(([key, value]) => (
                <div key={key} className="min-w-0">
                  <dt className="text-[10px] font-semibold uppercase tracking-wider text-text-secondary">
                    {key}
                  </dt>
                  <dd className="mt-0.5 break-all font-mono text-xs text-text-primary">
                    {typeof value === "string" ? value : JSON.stringify(value)}
                  </dd>
                </div>
              ))}
            </dl>
          ) : null}

          {hasFallbackText ? (
            <p className="mt-3 whitespace-pre-wrap wrap-break-word font-mono text-xs leading-relaxed text-text-primary">
              {log.details}
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export default AuditLogRow;