const AuditLogTableHeader = () => (
  <div className="hidden border-b border-border bg-surface-sunken/50 px-5 py-2.5 md:grid md:grid-cols-[140px_170px_minmax(0,1fr)_200px] md:items-center md:gap-6">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      When
    </div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Action
    </div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Entity
    </div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Actor
    </div>
  </div>
);

export default AuditLogTableHeader;