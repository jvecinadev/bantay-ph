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
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-danger/30 bg-danger-light px-4 py-3 text-sm text-danger">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-danger/20 text-[10px] font-bold">
            !
          </span>
          <span className="leading-relaxed">{getErrorMessage(meQuery.error)}</span>
        </div>

        <button
          type="button"
          onClick={() => meQuery.refetch()}
          className="inline-flex items-center justify-center rounded-lg border border-border-strong bg-surface px-3.5 py-2 text-sm font-semibold text-text-primary transition-colors hover:border-primary hover:text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20"
        >
          Retry
        </button>
      </div>
    );
  }

  const me = meQuery.data;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight text-text-primary">
          Profile
        </h1>
        <p className="mt-1.5 text-sm text-text-secondary">
          Manage your personal information and avatar.
        </p>
      </header>

      {savedBanner ? (
        <div className="flex items-center gap-2.5 rounded-xl border border-success/30 bg-success-light px-3.5 py-2.5 text-xs font-medium text-success">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-success" />
          {savedBanner}
        </div>
      ) : null}

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

        <div className="space-y-6 lg:col-span-2">
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