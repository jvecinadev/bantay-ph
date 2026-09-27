import { useEffect, useMemo, useRef, useState } from "react";
import type { MyProfile } from "../types";

const toNullable = (v: string) => {
  const t = v.trim();
  return t ? t : null;
};

type Props = {
  me: MyProfile;
  isSaving: boolean;
  onSave: (payload: Record<string, any>) => Promise<MyProfile>;
  fieldErrors: Record<string, string>;
};

const ProfileFormCard = ({ me, isSaving, onSave, fieldErrors }: Props) => {
  const hydratedRef = useRef(false);

  const [name, setName] = useState("");
  const [barangay, setBarangay] = useState("");
  const [cityMunicipality, setCityMunicipality] = useState("");
  const [province, setProvince] = useState("");
  const [postalCode, setPostalCode] = useState("");

  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [purokSitio, setPurokSitio] = useState("");
  const [landmark, setLandmark] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    // hydrate once (prevents overwriting user edits on refetch)
    if (hydratedRef.current) return;

    setName(me.name ?? "");
    setBarangay(me.profile.barangay ?? "");
    setCityMunicipality(me.profile.cityMunicipality ?? "");
    setProvince(me.profile.province ?? "");
    setPostalCode(me.profile.postalCode ?? "");

    setAddressLine1(me.profile.addressLine1 ?? "");
    setAddressLine2(me.profile.addressLine2 ?? "");
    setPurokSitio(me.profile.purokSitio ?? "");
    setLandmark(me.profile.landmark ?? "");
    setPhoneNumber(me.profile.phoneNumber ?? "");

    hydratedRef.current = true;
  }, [me]);

  const payload = useMemo(() => {
    return {
      name: name.trim(),

      barangay: toNullable(barangay),
      cityMunicipality: toNullable(cityMunicipality),
      province: toNullable(province),
      postalCode: toNullable(postalCode),

      addressLine1: toNullable(addressLine1),
      addressLine2: toNullable(addressLine2),
      purokSitio: toNullable(purokSitio),
      landmark: toNullable(landmark),
      phoneNumber: toNullable(phoneNumber),
    };
  }, [
    name,
    barangay,
    cityMunicipality,
    province,
    postalCode,
    addressLine1,
    addressLine2,
    purokSitio,
    landmark,
    phoneNumber,
  ]);

  const original = useMemo(() => {
    return {
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
    };
  }, [me]);

  const isDirty = useMemo(() => {
    return (
      payload.name !== original.name ||
      payload.barangay !== original.barangay ||
      payload.cityMunicipality !== original.cityMunicipality ||
      payload.province !== original.province ||
      payload.postalCode !== original.postalCode ||
      payload.addressLine1 !== original.addressLine1 ||
      payload.addressLine2 !== original.addressLine2 ||
      payload.purokSitio !== original.purokSitio ||
      payload.landmark !== original.landmark ||
      payload.phoneNumber !== original.phoneNumber
    );
  }, [payload, original]);

  const inputClass = (hasError: boolean) =>
    [
      "mt-2 w-full rounded-xl border bg-surface px-4 py-2.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors focus:outline-none focus:ring-4",
      hasError
        ? "border-danger/40 focus:border-danger focus:ring-danger/10"
        : "border-border-strong focus:border-primary focus:ring-primary/10",
    ].join(" ");

  const FieldError = ({ name }: { name: string }) =>
    fieldErrors[name] ? <div className="mt-1 text-xs text-danger">{fieldErrors[name]}</div> : null;

  return (
    <div className="rounded-2xl border border-border bg-surface p-6 shadow-card">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Profile
          </div>
          <div className="mt-1 text-sm text-text-secondary">
            Update your basic information and address.
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              // reset to server values
              hydratedRef.current = false;
              // triggers hydration effect on next render pass
              // (simpler than manually setting each field twice)
              // eslint-disable-next-line @typescript-eslint/no-unused-expressions
              hydratedRef.current;
              // force immediate reset:
              setName(me.name ?? "");
              setBarangay(me.profile.barangay ?? "");
              setCityMunicipality(me.profile.cityMunicipality ?? "");
              setProvince(me.profile.province ?? "");
              setPostalCode(me.profile.postalCode ?? "");
              setAddressLine1(me.profile.addressLine1 ?? "");
              setAddressLine2(me.profile.addressLine2 ?? "");
              setPurokSitio(me.profile.purokSitio ?? "");
              setLandmark(me.profile.landmark ?? "");
              setPhoneNumber(me.profile.phoneNumber ?? "");
              hydratedRef.current = true;
            }}
            disabled={!isDirty || isSaving}
            className="inline-flex items-center justify-center rounded-xl border border-border-strong bg-surface px-4 py-2 text-sm font-semibold text-text-primary hover:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Reset
          </button>

          <button
            type="button"
            disabled={!isDirty || isSaving}
            onClick={async () => {
              await onSave(payload);
            }}
            className="inline-flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-surface shadow-card hover:bg-primary-dark focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSaving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-6">
        {/* Basic */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Name
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass(!!fieldErrors.name)}
              autoComplete="name"
            />
            <FieldError name="name" />
          </div>

          <div>
            <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
              Phone number
            </label>
            <input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className={inputClass(!!fieldErrors.phoneNumber)}
              autoComplete="tel"
            />
            <FieldError name="phoneNumber" />
          </div>
        </div>

        {/* Location */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Location
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Barangay
              </label>
              <input
                value={barangay}
                onChange={(e) => setBarangay(e.target.value)}
                className={inputClass(!!fieldErrors.barangay)}
              />
              <FieldError name="barangay" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                City / Municipality
              </label>
              <input
                value={cityMunicipality}
                onChange={(e) => setCityMunicipality(e.target.value)}
                className={inputClass(!!fieldErrors.cityMunicipality)}
              />
              <FieldError name="cityMunicipality" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Province
              </label>
              <input
                value={province}
                onChange={(e) => setProvince(e.target.value)}
                className={inputClass(!!fieldErrors.province)}
              />
              <FieldError name="province" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Postal code
              </label>
              <input
                value={postalCode}
                onChange={(e) => setPostalCode(e.target.value)}
                className={inputClass(!!fieldErrors.postalCode)}
                inputMode="numeric"
              />
              <FieldError name="postalCode" />
            </div>
          </div>
        </div>

        {/* Address */}
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
            Address (optional)
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Address line 1
              </label>
              <input
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                className={inputClass(!!fieldErrors.addressLine1)}
              />
              <FieldError name="addressLine1" />
            </div>

            <div className="sm:col-span-2">
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Address line 2
              </label>
              <input
                value={addressLine2}
                onChange={(e) => setAddressLine2(e.target.value)}
                className={inputClass(!!fieldErrors.addressLine2)}
              />
              <FieldError name="addressLine2" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Purok / Sitio
              </label>
              <input
                value={purokSitio}
                onChange={(e) => setPurokSitio(e.target.value)}
                className={inputClass(!!fieldErrors.purokSitio)}
              />
              <FieldError name="purokSitio" />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                Landmark
              </label>
              <input
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                className={inputClass(!!fieldErrors.landmark)}
              />
              <FieldError name="landmark" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileFormCard;