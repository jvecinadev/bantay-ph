import { useMemo, useState } from "react";
import useMeProfileQuery from "../../features/users/hooks/useMeProfileQuery";
import { usePatchMeProfileMutation, useUploadMyAvatarMutation } from "../..//features/users/hooks/useProfileMutation";
import ProfilePageSkeleton from "../../features/users/components/ProfilePageSkeleton";
import AccountInfoCard from "../../features/users/components/AccountInfoCard";
import AvatarCard from "../../features/users/components/AvatarCard";
import { parseFieldErrors } from "../../lib/forms/parseFieldError";
import ProfileFormCard from "../../features/users/components/ProfileFormCard";
import { getErrorMessage } from "../../lib/helper/getErrorMessage";

const RegisterProfilePage = () => {
  const meQuery = useMeProfileQuery();
  const patchMutation = usePatchMeProfileMutation();
  const avatarMutation = useUploadMyAvatarMutation();

  const [savedBanner, setSavedBanner] = useState<string | null>(null);

  const fieldErrors = useMemo(() => {
    return parseFieldErrors(patchMutation.error);
  }, [patchMutation.error]);

  if (meQuery.status === "pending") return <ProfilePageSkeleton />;

  if (meQuery.status === "error") {
    return (
      <div className="space-y-3">
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{getErrorMessage(meQuery.error)}</span>
        </div>

        <button
          type="button"
          onClick={() => meQuery.refetch()}
          className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10"
        >
          Retry
        </button>
      </div>
    );
  }

  const me = meQuery.data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-border bg-surface p-5 shadow-card sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-text-primary">
              Profile
            </h1>
            <div className="mt-1 text-sm text-text-secondary">
              Manage your personal information and avatar.
            </div>
          </div>

          <button
            type="button"
            onClick={() => meQuery.refetch()}
            disabled={meQuery.isFetching}
            className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {meQuery.isFetching ? "Refreshing…" : "Refresh"}
          </button>
        </div>
      </div>

      {savedBanner ? (
        <div className="rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text-secondary shadow-card">
          {savedBanner}
        </div>
      ) : null}

      {/* Layout */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <AvatarCard
            name={me.name}
            avatarUrl={me.profile.avatarUrl}
            isUploading={avatarMutation.isPending}
            uploadError={avatarMutation.error ? getErrorMessage(avatarMutation.error) : null}
            onUpload={async (file) => {
              avatarMutation.reset();
              await avatarMutation.mutateAsync(file);
            }}
          />

          <AccountInfoCard me={me} />
        </div>

        <div className="lg:col-span-2 space-y-6">
          {/* Only show a banner for non-validation errors */}
          {patchMutation.error && Object.keys(fieldErrors).length === 0 ? (
            <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
              <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
                !
              </span>
              <span className="leading-relaxed">{getErrorMessage(patchMutation.error)}</span>
            </div>
          ) : null}

          <ProfileFormCard
            me={me}
            isSaving={patchMutation.isPending}
            fieldErrors={fieldErrors}
            onSave={async (payload) => {
              patchMutation.reset();
              setSavedBanner(null);

              const updated = await patchMutation.mutateAsync(payload);
              setSavedBanner(`Saved at ${new Date().toLocaleTimeString()}.`);

              return updated;
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default RegisterProfilePage;