import { useEffect, useMemo, useState } from "react";
import useSettingsQuery from "../../features/users/hooks/useSettingsQuery";
import usePatchSettingsMutation from "../../features/users/hooks/usePatchSettingsMutation";
import SettingsCard from "../../features/users/components/SettingsCard";
import ToggleField from "../../features/users/components/ToggleField";
import SaveBar from "../../features/users/components/SaveBar";
import ThemeField from "../../features/users/components/ThemeField";
import { buildFieldErrors } from "../../features/users/utils/settingsForm";
import type { MySettings } from "../../features/users/types";
import type { ApiError } from "../../lib/api/types";

const UserSettingsPage = () => {
  const q = useSettingsQuery();
  const patch = usePatchSettingsMutation();

  type Settings = MySettings["settings"];
  type PatchBody = Partial<Settings>;

  const [base, setBase] = useState<Settings | null>(null);
  const [draft, setDraft] = useState<Settings | null>(null);

  // init once from server
  useEffect(() => {
    if (!q.data) return;
    if (base) return;
    setBase(q.data.settings);
    setDraft(q.data.settings);
  }, [q.data, base]);

  const fieldErrors = useMemo(
    () => buildFieldErrors(patch.error as ApiError | undefined),
    [patch.error]
  );

  const errFor = (key: string) => fieldErrors[key] ?? fieldErrors[`settings.${key}`];

  const isDirty = useMemo(() => {
    if (!base || !draft) return false;
    return JSON.stringify(base) !== JSON.stringify(draft);
  }, [base, draft]);

  const onReset = () => {
    if (!base) return;
    setDraft(base);
  };

  const onSave = () => {
    if (!base || !draft) return;

    const changes: PatchBody = {};

    if (base.theme !== draft.theme) changes.theme = draft.theme;

    if (
      base.notifications.email !== draft.notifications.email ||
      base.notifications.sms !== draft.notifications.sms
    ) {
      changes.notifications = draft.notifications;
    }

    if (base.privacy.showNameInFeed !== draft.privacy.showNameInFeed) {
      changes.privacy = draft.privacy;
    }

    if (!Object.keys(changes).length) return;

    patch.mutate(changes, {
      onSuccess: (data) => {
        // response is MySettings -> sync local base/draft
        const next = (data as MySettings).settings;
        setBase(next);
        setDraft(next);
      },
    });
  };

  if (q.isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="h-7 w-40 rounded-lg bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
          <div className="h-28 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Failed to load settings</div>
          <div className="mt-1 text-xs text-muted-foreground">{q.error.message}</div>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-4">
          <div className="text-lg font-semibold text-foreground">Settings</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Manage your preferences.
          </div>

          <div className="mt-2 text-xs text-muted-foreground">
            {q.data?.isDefault ? "Using default settings" : "Custom settings"}
            {q.data?.updatedAt ? ` • Updated ${new Date(q.data.updatedAt).toLocaleString()}` : ""}
          </div>
        </div>

        {patch.error && !Object.keys(fieldErrors).length ? (
          <div className="mb-3 rounded-xl border border-border bg-card p-3 text-sm text-destructive">
            {(patch.error as ApiError).message}
          </div>
        ) : null}

        <div className="space-y-3">
          <SettingsCard title="Appearance" description="Control how the app looks.">
            <ThemeField
              value={draft.theme}
              disabled={patch.isPending}
              error={errFor("theme")}
              onChange={(next) => setDraft((d) => (d ? { ...d, theme: next } : d))}
            />
          </SettingsCard>

          <SettingsCard title="Notifications" description="Choose which alerts you receive.">
            <ToggleField
              label="Email notifications"
              checked={draft.notifications.email}
              disabled={patch.isPending}
              error={errFor("notifications.email")}
              onChange={(next) =>
                setDraft((d) =>
                  d ? { ...d, notifications: { ...d.notifications, email: next } } : d
                )
              }
            />
            <ToggleField
              label="SMS notifications"
              checked={draft.notifications.sms}
              disabled={patch.isPending}
              error={errFor("notifications.sms")}
              onChange={(next) =>
                setDraft((d) =>
                  d ? { ...d, notifications: { ...d.notifications, sms: next } } : d
                )
              }
            />
          </SettingsCard>

          <SettingsCard title="Privacy" description="Control what others can see.">
            <ToggleField
              label="Show my name in feed"
              checked={draft.privacy.showNameInFeed}
              disabled={patch.isPending}
              error={errFor("privacy.showNameInFeed")}
              onChange={(next) =>
                setDraft((d) =>
                  d ? { ...d, privacy: { ...d.privacy, showNameInFeed: next } } : d
                )
              }
            />
          </SettingsCard>
        </div>

        <SaveBar
          isDirty={isDirty}
          isSaving={patch.isPending}
          onReset={onReset}
          onSave={onSave}
        />
      </div>
    </div>
  );
};

export default UserSettingsPage;