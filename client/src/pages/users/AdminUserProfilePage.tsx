import { useMemo } from "react";
import { useParams } from "react-router-dom";
import useAuthStore from "../../stores/authStore";
import useAdminUserProfileQuery from "../../features/users/hooks/useAdminProfileQuery";
import ProfileCard from "../../features/users/components/ProfileCard";
import AvatarCircle from "../../features/users/components/AvatarCircle";
import KeyValueRow from "../../features/users/components/KeyValueRow";

const AdminUserProfilePage = () => {
  const { id } = useParams();
  const hasAnyPermission = useAuthStore((s) => s.hasAnyPermission);

  const canReadUsers = hasAnyPermission(["user:read"]);
  const userId = id ?? "";

  const q = useAdminUserProfileQuery(userId, canReadUsers && !!userId);

  const data = q.data;

  // NOTE: Adjust these selectors to your real admin response shape.
  const view = useMemo(() => {
    if (!data) return null;

    // Try common shapes:
    const user = (data as any).user ?? data;
    const profile = (user as any).profile ?? (data as any).profile ?? {};

    return {
      id: (user as any).id as string | undefined,
      name: (user as any).name as string | undefined,
      email: (user as any).email as string | undefined,
      status: (user as any).status as string | undefined,
      roleName: (user as any).role?.name as string | undefined,
      avatarUrl: profile?.avatarUrl as string | null | undefined,
      phoneNumber: (profile as any).phoneNumber as string | null | undefined,
      barangay: (profile as any).barangay as string | null | undefined,
      cityMunicipality: (profile as any).cityMunicipality as string | null | undefined,
      province: (profile as any).province as string | null | undefined,
      createdAt: (user as any).createdAt as string | undefined,
      updatedAt: (user as any).updatedAt as string | undefined,
    };
  }, [data]);

  if (!canReadUsers) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Access denied</div>
          <div className="mt-1 text-xs text-muted-foreground">
            You don’t have permission to view user profiles.
          </div>
        </div>
      </div>
    );
  }

  if (q.isLoading) {
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

  if (q.isError) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Failed to load user</div>
          <div className="mt-1 text-xs text-muted-foreground">{q.error.message}</div>
        </div>
      </div>
    );
  }

  if (!view) return null;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl space-y-3">
        <div>
          <div className="text-lg font-semibold text-foreground">User Profile</div>
          <div className="mt-1 text-sm text-muted-foreground">Admin view</div>
        </div>

        <ProfileCard title="User">
          <div className="flex items-center gap-3">
            <AvatarCircle src={view.avatarUrl} name={view.name ?? null} size="lg" />
            <div className="min-w-0">
              <div className="text-base font-semibold text-foreground truncate">{view.name ?? "—"}</div>
              <div className="mt-1 text-sm text-muted-foreground truncate">{view.email ?? "—"}</div>
              <div className="mt-1 text-xs text-muted-foreground">
                {view.roleName ? `Role: ${view.roleName}` : "Role: —"}
                {view.status ? ` • Status: ${view.status}` : ""}
              </div>
            </div>
          </div>
        </ProfileCard>

        <ProfileCard title="Details">
          <KeyValueRow label="User ID" value={view.id} />
          <KeyValueRow label="Phone" value={view.phoneNumber} />
          <KeyValueRow label="Barangay" value={view.barangay} />
          <KeyValueRow label="City / Municipality" value={view.cityMunicipality} />
          <KeyValueRow label="Province" value={view.province} />
          <KeyValueRow label="Created at" value={view.createdAt} />
          <KeyValueRow label="Updated at" value={view.updatedAt} />
        </ProfileCard>
      </div>
    </div>
  );
};

export default AdminUserProfilePage;