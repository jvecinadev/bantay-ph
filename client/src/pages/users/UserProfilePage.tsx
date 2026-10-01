import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import usePublicUserProfileQuery from "../../features/users/hooks/usePublicUserProfileQuery";
import useAdminUserPrivateProfileQuery from "../../features/users/hooks/useAdminUserPrivateProfileQuery";

import ProfileCard from "../../features/users/components/ProfileCard";
import KeyValueRow from "../../features/users/components/KeyValueRow";
import ProfileHeader from "../../features/users/components/ProfileHeader";
import { formatDateTime } from "../../features/users/utils/format";

const UserProfilePage = () => {
  const { id } = useParams();
  const userId = id ?? "";

  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const canViewPrivate = hasAnyPermission(["user:read"]);

  const publicQ = usePublicUserProfileQuery(userId, !!userId);
  const privateQ = useAdminUserPrivateProfileQuery(userId, canViewPrivate && !!userId);

  const mode = useMemo(() => {
    if (privateQ.data) return "private" as const;
    return "public" as const;
  }, [privateQ.data]);

  const isLoading = !!userId && (publicQ.isLoading || (canViewPrivate && privateQ.isLoading));

  if (!userId) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">No user selected</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="h-7 w-56 rounded-lg bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
          <div className="h-40 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (publicQ.isError) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Failed to load profile</div>
          <div className="mt-1 text-xs text-muted-foreground">{publicQ.error.message}</div>
        </div>
      </div>
    );
  }

  const pub = publicQ.data?.user;
  const publicName = pub?.name ?? "User";
  const publicAvatar = pub?.profile?.avatarUrl ?? null;

  const priv = privateQ.data?.user;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl space-y-3">
        <div>
          <div className="text-lg font-semibold text-foreground">Profile</div>
          <div className="mt-1 text-sm text-muted-foreground">
            {mode === "private" ? "Admin view" : "Public view"}
          </div>
        </div>

        <ProfileCard title="User">
          <ProfileHeader
            name={priv?.name ?? publicName}
            avatarUrl={priv?.profile.avatarUrl ?? publicAvatar}
            subtitle={priv ? priv.email : undefined}
            metaRight={priv ? `${priv.role.name} • ${priv.status}` : undefined}
          />
        </ProfileCard>

        {/* PUBLIC: only what endpoint provides */}
        {mode === "public" ? (
          <ProfileCard title="Public info" description="Visible to all users.">
            <KeyValueRow label="User ID" value={pub?.id} />
          </ProfileCard>
        ) : null}

        {/* PRIVATE: admin-only details */}
        {priv ? (
          <>
            <ProfileCard title="Details">
              <KeyValueRow label="User ID" value={priv.id} />
              <KeyValueRow label="Status" value={priv.status} />
              <KeyValueRow label="Role" value={priv.role.name} />
              <KeyValueRow label="Role ID" value={String(priv.role.id)} />
              <KeyValueRow label="Phone number" value={priv.profile.phoneNumber} />
            </ProfileCard>

            <ProfileCard title="Address">
              <KeyValueRow label="Address line 1" value={priv.profile.addressLine1} />
              <KeyValueRow label="Address line 2" value={priv.profile.addressLine2} />
              <KeyValueRow label="Purok / Sitio" value={priv.profile.purokSitio} />
              <KeyValueRow label="Barangay" value={priv.profile.barangay} />
              <KeyValueRow label="City / Municipality" value={priv.profile.cityMunicipality} />
              <KeyValueRow label="Province" value={priv.profile.province} />
              <KeyValueRow label="Postal code" value={priv.profile.postalCode} />
              <KeyValueRow label="Landmark" value={priv.profile.landmark} />
            </ProfileCard>

            <ProfileCard title="Timestamps">
              <KeyValueRow label="Account created" value={formatDateTime(priv.createdAt)} />
              <KeyValueRow label="Account updated" value={formatDateTime(priv.updatedAt)} />
              <KeyValueRow label="Profile created" value={formatDateTime(priv.profile.createdAt)} />
              <KeyValueRow label="Profile updated" value={formatDateTime(priv.profile.updatedAt)} />
            </ProfileCard>
          </>
        ) : null}

        {/* Optional: if admin fetch failed, still show public but you may want a hint */}
        {canViewPrivate && privateQ.isError ? (
          <div className="rounded-xl border border-border bg-card p-3 text-xs text-muted-foreground">
            Private profile unavailable: {privateQ.error.message}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default UserProfilePage;