import { getInitials } from "../../../lib/helper/getInitials";

const ROLE_TINTS: Record<string, string> = {
  RESIDENT: "bg-surface-sunken text-text-secondary",
  VALIDATOR: "bg-status-under-verification-bg text-status-under-verification",
  BARANGAY_STAFF: "bg-status-assigned-bg text-status-assigned",
  ADMIN: "bg-primary-light text-primary",
};

type Props = {
  name: string;
  avatarUrl: string | null;
  email?: string;
  roleName?: string;
  status?: string;
};

const ProfileHero = ({ name, avatarUrl, email, roleName, status }: Props) => {
  const initials = getInitials(name);
  const roleTint = roleName ? ROLE_TINTS[roleName] ?? ROLE_TINTS.RESIDENT : null;
  const isActive = status === "ACTIVE";
  const showBadges = !!roleName && !!status;

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="flex flex-col items-start gap-4 p-6 sm:flex-row sm:items-center">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-surface-sunken">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt=""
              className="h-full w-full object-cover"
              draggable={false}
            />
          ) : (
            <span className="text-lg font-bold tracking-tight text-text-secondary">
              {initials}
            </span>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <h2 className="truncate text-xl font-bold tracking-tight text-text-primary">
            {name}
          </h2>
          {email ? (
            <div className="mt-1 truncate text-sm text-text-secondary">
              {email}
            </div>
          ) : null}

          {showBadges ? (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span
                className={[
                  "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider",
                  roleTint,
                ].join(" ")}
              >
                {roleName.replace(/_/g, " ")}
              </span>

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
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ProfileHero;