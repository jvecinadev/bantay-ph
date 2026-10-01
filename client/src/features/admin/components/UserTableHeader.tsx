const UserTableHeader = () => (
  <div className="hidden border-b border-border bg-surface-sunken/50 px-5 py-2.5 md:grid md:grid-cols-[minmax(0,1fr)_130px_130px_220px] md:items-center md:gap-6">
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      User
    </div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Role
    </div>
    <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Status
    </div>
    <div className="text-right text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      Actions
    </div>
  </div>
);

export default UserTableHeader;