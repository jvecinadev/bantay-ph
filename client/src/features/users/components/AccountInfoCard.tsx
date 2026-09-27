import type { MyProfile } from "../types";

type Props = {
  me: MyProfile;
};

const AccountInfoCard = ({ me }: Props) => {
  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
        Account
      </div>

      <div className="mt-4 space-y-3">
        <div>
          <div className="text-xs text-text-secondary">Email</div>
          <div className="mt-1 text-sm font-semibold text-text-primary wrap-break-word">{me.email}</div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-text-secondary">Role</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">{me.role}</div>
          </div>
          <div>
            <div className="text-xs text-text-secondary">Status</div>
            <div className="mt-1 text-sm font-semibold text-text-primary">{me.status}</div>
          </div>
        </div>

        <div>
          <div className="text-xs text-text-secondary">Member since</div>
          <div className="mt-1 text-sm font-semibold text-text-primary">
            {new Date(me.createdAt).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountInfoCard;