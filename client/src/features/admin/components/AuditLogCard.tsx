import type { AuditLog } from "../types";

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

const AuditLogCard = ({ log }: Props) => {
  const parsed = safeParseDetails(log.details);

  return (
    <div className="rounded-xl border border-border bg-surface p-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="text-sm font-semibold text-text-primary">{log.action}</div>
          <div className="mt-1 text-xs text-text-secondary">
            {log.entityType} •{" "}
            <span className="text-text-primary">{log.entityId}</span>
          </div>
          <div className="mt-1 text-xs text-text-secondary">
            By <span className="text-text-primary">{log.user?.name}</span> ({log.user?.role?.name}) •{" "}
            {new Date(log.createdAt).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="mt-3 rounded-lg border border-border bg-background p-3">
        <div className="text-xs font-medium text-text-primary">Details</div>
        {parsed ? (
          <div className="mt-2 space-y-1">
            {Object.entries(parsed).map(([k, v]) => (
              <div key={k} className="text-xs text-text-secondary">
                <span className="text-text-primary">{k}:</span> {String(v)}
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-2 text-xs text-text-secondary">{log.details}</div>
        )}
      </div>
    </div>
  );
};

export default AuditLogCard;