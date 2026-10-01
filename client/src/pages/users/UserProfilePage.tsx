import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import usePublicUserProfileQuery from "../../features/users/hooks/usePublicUserProfileQuery";
import useAdminUserPrivateProfileQuery from "../../features/users/hooks/useAdminUserPrivateProfileQuery";
import { formatDateTime } from "../../features/users/utils/format";

import DataRow from "../../shared/ui/DataRow";
import DataSection from "../../shared/ui/DataSection";
import ProfileHero from "../../features/users/components/ProfileHero";
import ProfileModePill from "../../features/users/components/ProfileModePill";

const UserProfilePage = () => {
  const { id } = useParams();
  const userId = id ?? "";

  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);
  const canViewPrivate = hasAnyPermission(["user:read"]);

  const publicQ = usePublicUserProfileQuery(userId, !!userId);
  const privateQ = useAdminUserPrivateProfileQuery(userId, canViewPrivate && !!userId);

  const isPrivate = useMemo(
    () => canViewPrivate && !!privateQ.data,
    [canViewPrivate, privateQ.data],
  );

  const isLoading =
    !!userId && (publicQ.isLoading || (canViewPrivate && privateQ.isLoading));

  if (!userId) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="rounded-2xl border border-dashed border-border-strong bg-surface-sunken px-6 py-14 text-center">
          <div className="text-sm font-semibold text-text-primary">
            No user selected
          </div>
          <div className="mt-1 text-xs text-text-secondary">
            Pick a user from the list to view their profile.
          </div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        className={[
          "mx-auto w-full space-y-10",
          canViewPrivate ? "max-w-5xl" : "max-w-2xl",
        ].join(" ")}
      >
        <div className="animate-pulse space-y-2">
          <div className="h-7 w-32 rounded bg-surface-sunken" />
          <div className="h-3 w-64 rounded bg-surface-sunken" />
        </div>

        <div className="animate-pulse rounded-2xl border border-border bg-surface p-6 shadow-card">
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 shrink-0 rounded-full bg-surface-sunken" />
            <div className="flex-1 space-y-2.5">
              <div className="h-5 w-48 rounded bg-surface-sunken" />
              <div className="h-3 w-32 rounded bg-surface-sunken" />
            </div>
          </div>
        </div>

        {canViewPrivate ? (
          <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-3 w-20 rounded bg-surface-sunken" />
                <div className="mt-3 divide-y divide-border border-y border-border">
                  {[...Array(5)].map((_, j) => (
                    <div
                      key={j}
                      className="grid grid-cols-[140px_1fr] items-center gap-x-6 py-2.5"
                    >
                      <div className="h-3 w-20 rounded bg-surface-sunken" />
                      <div className="h-3 w-32 rounded bg-surface-sunken" />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  if (publicQ.isError) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{publicQ.error.message}</span>
        </div>
      </div>
    );
  }

  const pub = publicQ.data?.user;
  const priv = privateQ.data?.user;

  const name = priv?.name ?? pub?.name ?? "User";
  const avatarUrl = priv?.profile.avatarUrl ?? pub?.avatarUrl ?? null;

  return (
    <div
      className={[
        "mx-auto w-full space-y-10",
        isPrivate ? "max-w-5xl" : "max-w-2xl",
      ].join(" ")}
    >
      <header>
        <div className="flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Profile
          </h1>
          <ProfileModePill mode={isPrivate ? "private" : "public"} />
        </div>

        <p className="mt-1.5 text-sm text-text-secondary">
          {isPrivate
            ? "Full account details and address information."
            : "Publicly visible information about this user."}
        </p>
      </header>

      <ProfileHero
        name={name}
        avatarUrl={avatarUrl}
        email={priv?.email}
        roleName={priv?.role.name}
        status={priv?.status}
      />

      {isPrivate && priv ? (
        <div className="grid gap-x-16 gap-y-10 lg:grid-cols-2">
          <div className="space-y-10">
            <DataSection title="Details">
              <DataRow label="User ID" value={priv.id} mono />
              <DataRow label="Status" value={priv.status} />
              <DataRow label="Role" value={priv.role.name.replace(/_/g, " ")} />
              <DataRow label="Role ID" value={String(priv.role.id)} mono />
              <DataRow label="Phone number" value={priv.profile.phoneNumber} />
            </DataSection>

            <DataSection title="Timestamps">
              <DataRow label="Account created" value={formatDateTime(priv.createdAt)} />
              <DataRow label="Account updated" value={formatDateTime(priv.updatedAt)} />
              <DataRow label="Profile created" value={formatDateTime(priv.profile.createdAt)} />
              <DataRow label="Profile updated" value={formatDateTime(priv.profile.updatedAt)} />
            </DataSection>
          </div>

          <div className="space-y-10">
            <DataSection title="Address">
              <DataRow label="Address line 1" value={priv.profile.addressLine1} />
              <DataRow label="Address line 2" value={priv.profile.addressLine2} />
              <DataRow label="Purok / Sitio" value={priv.profile.purokSitio} />
              <DataRow label="Barangay" value={priv.profile.barangay} />
              <DataRow label="City / Municipality" value={priv.profile.cityMunicipality} />
              <DataRow label="Province" value={priv.profile.province} />
              <DataRow label="Postal code" value={priv.profile.postalCode} />
              <DataRow label="Landmark" value={priv.profile.landmark} />
            </DataSection>
          </div>
        </div>
      ) : null}

      {!isPrivate && pub ? (
        <DataSection
          title="Public info"
          description="Visible to everyone"
        >
          <DataRow label="User ID" value={pub.id} mono />
        </DataSection>
      ) : null}

      {canViewPrivate && privateQ.isError ? (
        <div className="flex items-start gap-2.5 rounded-xl border border-border bg-surface-sunken px-4 py-3 text-xs text-text-secondary">
          <span className="mt-0.5 h-1.5 w-1.5 shrink-0 rounded-full bg-text-secondary/60" />
          <span className="leading-relaxed">
            Private details unavailable — {privateQ.error.message}
          </span>
        </div>
      ) : null}
    </div>
  );
};

export default UserProfilePage;