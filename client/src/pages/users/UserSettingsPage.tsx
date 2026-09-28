import { useEffect, useMemo, useState } from "react";
import useSettingsQuery from "../../features/users/hooks/useSettingsQuery";
import usePatchSettingsMutation from "../../features/users/hooks/usePatchSettingsQuery";
import SettingsCard from "../../features/users/components/SettingsCard";
import ToggleField from "../../features/users/components/ToggleField";
import ThemeField from "../../features/users/components/ThemeField";
import { buildFieldErrors } from "../../features/users/utils/settingsForm";

const UserSettingsPage = () => {
  const q = useSettingsQuery();
  const patch = usePatchSettingsMutation();

  type MySettings = NonNullable<typeof q.data>;

  const [base, setBase] = useState<MySettings | null>(null);
  const [draft, setDraft] = useState<MySettings | null>(null);

  useEffect(() => {
    if (!q.data) return;
    setBase(q.data);
    setDraft(q.data);
  }, [q.data]);

  const fieldErrors = useMemo(() => buildFieldErrors(patch.error), [patch.error]);

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

    type Vars = Parameters<typeof patch.mutate>[0];
    const changes: Vars = {};

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
        // keep local state synced with server response (and cache)
        setBase(data as MySettings);
        setDraft(data as MySettings);
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
        </div>

        {patch.error && !Object.keys(fieldErrors).length ? (
          <div className="mb-3 rounded-xl border border-border bg-card p-3 text-sm text-destructive">
            {patch.error.message}
          </div>
        ) : null}

        <div className="space-y-3">
          <SettingsCard title="Appearance" description="Control how the app looks.">
            <ThemeField
              value={draft.theme as any}
              disabled={patch.isPending}
              error={fieldErrors["theme"]}
              onChange={(next) => setDraft((d) => (d ? { ...d, theme: next } : d))}
            />
          </SettingsCard>

          <SettingsCard title="Notifications" description="Choose which alerts you receive.">
            <ToggleField
              label="Email notifications"
              checked={draft.notifications.email}
              disabled={patch.isPending}
              error={fieldErrors["notifications.email"]}
              onChange={(next) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        notifications: { ...d.notifications, email: next },
                      }
                    : d
                )
              }
            />
            <ToggleField
              label="SMS notifications"
              checked={draft.notifications.sms}
              disabled={patch.isPending}
              error={fieldErrors["notifications.sms"]}
              onChange={(next) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        notifications: { ...d.notifications, sms: next },
                      }
                    : d
                )
              }
            />
          </SettingsCard>

          <SettingsCard title="Privacy" description="Control what others can see.">
            <ToggleField
              label="Show my name in feed"
              checked={draft.privacy.showNameInFeed}
              disabled={patch.isPending}
              error={fieldErrors["privacy.showNameInFeed"]}
              onChange={(next) =>
                setDraft((d) =>
                  d
                    ? {
                        ...d,
                        privacy: { ...d.privacy, showNameInFeed: next },
                      }
                    : d
                )
              }
            />
          </SettingsCard>
        </div>

        <div className="mt-4 flex items-center justify-end gap-2">
          <button
            type="button"
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm text-foreground disabled:opacity-50"
            disabled={!isDirty || patch.isPending}
            onClick={onReset}
          >
            Reset
          </button>
          <button
            type="button"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
            disabled={!isDirty || patch.isPending}
            onClick={onSave}
          >
            {patch.isPending ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSettingsPage;