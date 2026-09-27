import type { MyProfile } from "../types";

type Props = {
  me: MyProfile;
};

const ROLE_TINTS: Record<string, string> = {
  RESIDENT: "bg-surface-sunken text-text-secondary",
  VALIDATOR: "bg-status-under-verification-bg text-status-under-verification",
  BARANGAY_STAFF: "bg-status-assigned-bg text-status-assigned",
  ADMIN: "bg-primary-light text-primary",
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
  <span
    className={[
      "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
      ROLE_TINTS[role] ?? "bg-surface-sunken text-text-secondary",
    ].join(" ")}
  >
    {role.replace(/_/g, " ")}
  </span>
);

const formatDate = (value: string) => {
  const date = new Date(value);
  return {
    date: date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }),
    time: date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    }),
  };
};

const Row = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <div className="px-5 py-4">
    <dt className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
      {label}
    </dt>
    <dd className="mt-1.5">{children}</dd>
  </div>
);

const AccountInfoCard = ({ me }: Props) => {
  const { date, time } = formatDate(me.createdAt);

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Account
        </div>
      </div>

      <dl className="divide-y divide-border">
        <Row label="Email">
          <span className="break-all text-sm font-medium text-text-primary">
            {me.email}
          </span>
        </Row>

        <Row label="Role">
          <RolePill role={me.role} />
        </Row>

        <Row label="Status">
          <StatusPill status={me.status} />
        </Row>

        <Row label="Member since">
          <span className="text-sm font-medium text-text-primary">{date}</span>
          <span className="ml-2 text-xs text-text-secondary">{time}</span>
        </Row>
      </dl>
    </div>
  );
};

export default AccountInfoCard;