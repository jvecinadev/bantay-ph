import type { MyProfile } from "../types";

type Props = {
  me: MyProfile;
};

const StatusPill = ({ status }: { status: string }) => {
  const isActive = status === "ACTIVE";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
        isActive
          ? "bg-success-light text-success"
          : "bg-danger-light text-danger",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          isActive ? "bg-success" : "bg-danger",
        ].join(" ")}
      />
      {status}
    </span>
  );
};

const RolePill = ({ role }: { role: string }) => (
  <span className="inline-flex items-center rounded-full bg-surface-sunken px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
    {role.replace(/_/g, " ")}
  </span>
);

const AccountInfoCard = ({ me }: Props) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Account
        </div>
      </div>

      <dl className="divide-y divide-border">
        <div className="px-5 py-4">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Email
          </dt>
          <dd className="mt-1.5 wrap-break-word text-sm font-medium text-text-primary">
            {me.email}
          </dd>
        </div>

        <div className="px-5 py-4">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Role
          </dt>
          <dd className="mt-2">
            <RolePill role={me.role} />
          </dd>
        </div>

        <div className="px-5 py-4">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Status
          </dt>
          <dd className="mt-2">
            <StatusPill status={me.status} />
          </dd>
        </div>

        <div className="px-5 py-4">
          <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
            Member since
          </dt>
          <dd className="mt-1.5 text-sm font-medium text-text-primary">
            {new Date(me.createdAt).toLocaleString()}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export default AccountInfoCard;