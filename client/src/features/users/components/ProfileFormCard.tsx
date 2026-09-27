import { useMemo, useState } from "react";
import type { MyProfile } from "../types";

type FormState = {
  name: string;
  barangay: string;
  cityMunicipality: string;
  province: string;
  postalCode: string;
  addressLine1: string;
  addressLine2: string;
  purokSitio: string;
  landmark: string;
  phoneNumber: string;
};

type Props = {
  me: MyProfile;
  isSaving: boolean;
  onSave: (payload: Record<string, unknown>) => Promise<MyProfile>;
  fieldErrors: Record<string, string>;
};

const toNullable = (v: string) => {
  const t = v.trim();
  return t ? t : null;
};

const hydrate = (me: MyProfile): FormState => ({
  name: me.name ?? "",
  barangay: me.profile.barangay ?? "",
  cityMunicipality: me.profile.cityMunicipality ?? "",
  province: me.profile.province ?? "",
  postalCode: me.profile.postalCode ?? "",
  addressLine1: me.profile.addressLine1 ?? "",
  addressLine2: me.profile.addressLine2 ?? "",
  purokSitio: me.profile.purokSitio ?? "",
  landmark: me.profile.landmark ?? "",
  phoneNumber: me.profile.phoneNumber ?? "",
});

const originalFrom = (me: MyProfile) => ({
  name: me.name ?? "",
  barangay: me.profile.barangay ?? null,
  cityMunicipality: me.profile.cityMunicipality ?? null,
  province: me.profile.province ?? null,
  postalCode: me.profile.postalCode ?? null,
  addressLine1: me.profile.addressLine1 ?? null,
  addressLine2: me.profile.addressLine2 ?? null,
  purokSitio: me.profile.purokSitio ?? null,
  landmark: me.profile.landmark ?? null,
  phoneNumber: me.profile.phoneNumber ?? null,
});

type FieldProps = {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
  autoComplete?: string;
  inputMode?: "text" | "numeric" | "tel" | "email" | "url" | "search";
  className?: string;
};

const Field = ({
  label,
  name,
  value,
  onChange,
  error,
  autoComplete,
  inputMode,
  className,
}: FieldProps) => (
  <div className={className}>
    <label
      htmlFor={name}
      className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary"
    >
      {label}
    </label>
    <input
      id={name}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      autoComplete={autoComplete}
      inputMode={inputMode}
      className={[
        "mt-2 w-full rounded-xl border bg-surface px-3.5 py-2.5 text-sm text-text-primary transition-colors focus:outline-none focus:ring-4",
        error
          ? "border-danger/40 focus:border-danger focus:ring-danger/10"
          : "border-border-strong focus:border-primary focus:ring-primary/10",
      ].join(" ")}
    />
    {error ? (
      <p className="mt-1.5 text-xs leading-relaxed text-danger">{error}</p>
    ) : null}
  </div>
);

const SectionLabel = ({ children }: { children: string }) => (
  <div className="text-[11px] font-semibold uppercase tracking-wider text-text-secondary">
    {children}
  </div>
);

const ProfileFormCard = ({ me, isSaving, onSave, fieldErrors }: Props) => {
  const [form, setForm] = useState<FormState>(() => hydrate(me));

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const payload = useMemo(
    () => ({
      name: form.name.trim(),
      barangay: toNullable(form.barangay),
      cityMunicipality: toNullable(form.cityMunicipality),
      province: toNullable(form.province),
      postalCode: toNullable(form.postalCode),
      addressLine1: toNullable(form.addressLine1),
      addressLine2: toNullable(form.addressLine2),
      purokSitio: toNullable(form.purokSitio),
      landmark: toNullable(form.landmark),
      phoneNumber: toNullable(form.phoneNumber),
    }),
    [form],
  );

  const original = useMemo(() => originalFrom(me), [me]);

  const isDirty = useMemo(
    () =>
      (Object.keys(payload) as Array<keyof typeof payload>).some(
        (key) => payload[key] !== original[key],
      ),
    [payload, original],
  );

  const handleReset = () => setForm(hydrate(me));

  const handleSave = async () => {
    if (!isDirty || isSaving) return;
    await onSave(payload);
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <div className="border-b border-border px-5 py-4 sm:px-6">
        <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
          Profile
        </div>
        <p className="mt-1 text-sm text-text-secondary">
          Update your basic information and address.
        </p>
      </div>

      <div className="space-y-6 p-5 sm:p-6">
        <section className="space-y-3">
          <SectionLabel>Basic</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Name"
              name="name"
              value={form.name}
              onChange={(v) => update("name", v)}
              error={fieldErrors.name}
              autoComplete="name"
            />
            <Field
              label="Phone number"
              name="phoneNumber"
              value={form.phoneNumber}
              onChange={(v) => update("phoneNumber", v)}
              error={fieldErrors.phoneNumber}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>Location</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Barangay"
              name="barangay"
              value={form.barangay}
              onChange={(v) => update("barangay", v)}
              error={fieldErrors.barangay}
            />
            <Field
              label="City / Municipality"
              name="cityMunicipality"
              value={form.cityMunicipality}
              onChange={(v) => update("cityMunicipality", v)}
              error={fieldErrors.cityMunicipality}
            />
            <Field
              label="Province"
              name="province"
              value={form.province}
              onChange={(v) => update("province", v)}
              error={fieldErrors.province}
            />
            <Field
              label="Postal code"
              name="postalCode"
              value={form.postalCode}
              onChange={(v) => update("postalCode", v)}
              error={fieldErrors.postalCode}
              inputMode="numeric"
            />
          </div>
        </section>

        <section className="space-y-3">
          <SectionLabel>Address (optional)</SectionLabel>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Address line 1"
              name="addressLine1"
              value={form.addressLine1}
              onChange={(v) => update("addressLine1", v)}
              error={fieldErrors.addressLine1}
              className="sm:col-span-2"
            />
            <Field
              label="Address line 2"
              name="addressLine2"
              value={form.addressLine2}
              onChange={(v) => update("addressLine2", v)}
              error={fieldErrors.addressLine2}
              className="sm:col-span-2"
            />
            <Field
              label="Purok / Sitio"
              name="purokSitio"
              value={form.purokSitio}
              onChange={(v) => update("purokSitio", v)}
              error={fieldErrors.purokSitio}
            />
            <Field
              label="Landmark"
              name="landmark"
              value={form.landmark}
              onChange={(v) => update("landmark", v)}
              error={fieldErrors.landmark}
            />
          </div>
        </section>
      </div>

      <div className="flex items-center justify-end gap-2.5 border-t border-border bg-surface-sunken/50 px-5 py-4 sm:px-6">
        <button
          type="button"
          onClick={handleReset}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center justify-center rounded-lg px-3.5 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-surface-sunken hover:text-text-primary focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Reset
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={!isDirty || isSaving}
          className="inline-flex items-center justify-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-surface shadow-card transition-all hover:bg-primary-dark hover:shadow-card-hover focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </div>
    </div>
  );
};

export default ProfileFormCard;