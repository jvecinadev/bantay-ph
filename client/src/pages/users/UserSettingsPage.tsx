import { useEffect, useMemo, useState } from "react";
import useSettingsQuery from "../../features/users/hooks/useSettingsQuery";
import usePatchSettingsMutation from "../../features/users/hooks/usePatchSettingsQuery";
import { buildFieldErrors, humanizeKey, shallowDiff } from "../../features/users/utils/settingsForm";
import ToggleField from "../../features/users/components/ToggleField";
import TextField from "../../features/users/components/TextField";
import NumberField from "../../features/users/components/NumberField";

const UserSettingsPage = () => {
  const q = useSettingsQuery();
  const patch = usePatchSettingsMutation();

  type MySettings = NonNullable<typeof q.data>;

  const [draft, setDraft] = useState<MySettings | null>(null);
  const [base, setBase] = useState<MySettings | null>(null);

  // initialize draft once data arrives; don't clobber if user is editing
  useEffect(() => {
    if (!q.data) return;
    if (!base) {
      setBase(q.data as MySettings);
      setDraft(q.data as MySettings);
    }
  }, [q.data, base]);

  // if server data changes (refetch) AND user isn't dirty, refresh the draft
  useEffect(() => {
    if (!q.data || !base || !draft) return;

    const isDirty = JSON.stringify(draft) !== JSON.stringify(base);
    if (!isDirty) {
      setBase(q.data as MySettings);
      setDraft(q.data as MySettings);
    }
  }, [q.data, base, draft]);

  const fieldErrors = useMemo(() => buildFieldErrors(patch.error as any), [patch.error]);

  const isDirty = useMemo(() => {
    if (!base || !draft) return false;
    return JSON.stringify(draft) !== JSON.stringify(base);
  }, [base, draft]);

  const onSave = () => {
    if (!base || !draft) return;
    const changes = shallowDiff(base, draft);
    patch.mutate(changes, {
      onSuccess: (data: any) => {
        // keep local state aligned with what server returned (and what cache now has)
        setBase(data);
        setDraft(data);
      },
    });
  };

  const onReset = () => {
    if (!base) return;
    setDraft(base);
  };

  if (q.isLoading) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl space-y-3">
          <div className="h-8 w-40 rounded-lg bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
          <div className="h-24 rounded-xl bg-muted" />
        </div>
      </div>
    );
  }

  if (q.isError) {
    return (
      <div className="p-4">
        <div className="mx-auto max-w-2xl rounded-xl border border-border bg-card p-4">
          <div className="text-sm font-medium text-foreground">Failed to load settings</div>
          <div className="mt-1 text-xs text-muted-foreground">{q.error?.message}</div>
        </div>
      </div>
    );
  }

  if (!draft) return null;

  const entries = Object.entries(draft) as Array<[keyof MySettings & string, any]>;

  return (
    <div className="p-4">
      <div className="mx-auto max-w-2xl">
        <div className="mb-3">
          <div className="text-lg font-semibold text-foreground">Settings</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Manage your preferences for Bantay PH.
          </div>
        </div>

        {patch.error && !Object.keys(fieldErrors).length ? (
          <div className="mb-3 rounded-xl border border-border bg-card p-3 text-sm text-destructive">
            {(patch.error as any)?.message ?? "Failed to save settings"}
          </div>
        ) : null}

        <div className="space-y-3">
          {entries.map(([key, value]) => {
            const err = fieldErrors[key];

            if (typeof value === "boolean") {
              return (
                <ToggleField
                  key={key}
                  label={humanizeKey(key)}
                  checked={value}
                  disabled={patch.isPending}
                  error={err}
                  onChange={(next) => setDraft((d) => (d ? ({ ...d, [key]: next } as MySettings) : d))}
                />
              );
            }

            if (typeof value === "number" || value === null) {
              return (
                <NumberField
                  key={key}
                  label={humanizeKey(key)}
                  value={typeof value === "number" ? value : null}
                  disabled={patch.isPending}
                  error={err}
                  onChange={(next) => setDraft((d) => (d ? ({ ...d, [key]: next } as MySettings) : d))}
                />
              );
            }

            // default string-ish editor
            return (
              <TextField
                key={key}
                label={humanizeKey(key)}
                value={value ?? ""}
                disabled={patch.isPending}
                error={err}
                onChange={(next) =>
                  setDraft((d) => (d ? ({ ...d, [key]: next } as MySettings) : d))
                }
              />
            );
          })}
        </div>

        {/* Save bar */}
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