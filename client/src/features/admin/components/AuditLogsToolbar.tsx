type Props = {
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  hasActiveFilters: boolean;
  onActionChange: (v: string) => void;
  onEntityTypeChange: (v: string) => void;
  onEntityIdChange: (v: string) => void;
  onUserIdChange: (v: string) => void;
  onClear: () => void;
};

const inputClass =
  "w-full rounded-lg border border-border-strong bg-surface px-2.5 py-2 font-mono text-xs text-text-primary placeholder:font-sans placeholder:text-text-secondary/60 transition-colors hover:border-text-secondary/40 focus:border-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20";

const AuditLogsToolbar = ({
  action,
  entityType,
  entityId,
  userId,
  hasActiveFilters,
  onActionChange,
  onEntityTypeChange,
  onEntityIdChange,
  onUserIdChange,
  onClear,
}: Props) => (
  <div className="space-y-3">
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
      <input
        value={action}
        onChange={(e) => onActionChange(e.target.value)}
        placeholder="Filter by action…"
        aria-label="Filter by action"
        className={inputClass}
      />
      <input
        value={entityType}
        onChange={(e) => onEntityTypeChange(e.target.value)}
        placeholder="Filter by entity type…"
        aria-label="Filter by entity type"
        className={inputClass}
      />
      <input
        value={entityId}
        onChange={(e) => onEntityIdChange(e.target.value)}
        placeholder="Filter by entity ID…"
        aria-label="Filter by entity ID"
        className={inputClass}
      />
      <input
        value={userId}
        onChange={(e) => onUserIdChange(e.target.value)}
        placeholder="Filter by user ID…"
        aria-label="Filter by user ID"
        className={inputClass}
      />
    </div>

    {hasActiveFilters ? (
      <div className="flex justify-end">
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg px-2.5 py-1.5 text-xs font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Clear all
        </button>
      </div>
    ) : null}
  </div>
);

export default AuditLogsToolbar;