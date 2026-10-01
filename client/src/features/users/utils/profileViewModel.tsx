export type ProfileViewModel = {
  id?: string;
  name?: string;
  email?: string;
  status?: string;
  roleName?: string;

  avatarUrl?: string | null;

  phoneNumber?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  purokSitio?: string | null;
  landmark?: string | null;

  barangay?: string | null;
  cityMunicipality?: string | null;
  province?: string | null;
  postalCode?: string | null;

  createdAt?: string | null;
  updatedAt?: string | null;
};

const isObj = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const pickObj = (v: unknown, key: string): Record<string, unknown> | undefined => {
  if (!isObj(v)) return undefined;
  const child = v[key];
  return isObj(child) ? child : undefined;
};

const pickStr = (v: unknown, key: string): string | undefined => {
  if (!isObj(v)) return undefined;
  const val = v[key];
  return typeof val === "string" ? val : undefined;
};

const pickStrOrNull = (v: unknown, key: string): string | null | undefined => {
  if (!isObj(v)) return undefined;
  const val = v[key];
  if (typeof val === "string") return val;
  if (val === null) return null;
  return undefined;
};

export const toProfileViewModel = (data: unknown): ProfileViewModel => {
  const root = isObj(data) ? data : {};
  const user = pickObj(root, "user") ?? root;

  const role = pickObj(user, "role");
  const profile = pickObj(user, "profile") ?? pickObj(root, "profile") ?? undefined;

  const extended = root;

  return {
    id: pickStr(user, "id"),
    name: pickStr(user, "name") ?? pickStr(root, "name"),
    email: pickStr(user, "email") ?? pickStr(root, "email"),
    status: pickStr(user, "status") ?? pickStr(root, "status"),
    roleName: role ? pickStr(role, "name") : undefined,

    avatarUrl:
      (profile ? pickStrOrNull(profile, "avatarUrl") : undefined) ??
      pickStrOrNull(root, "avatarUrl"),

    phoneNumber:
      pickStrOrNull(extended, "phoneNumber") ?? (profile ? pickStrOrNull(profile, "phoneNumber") : undefined),

    addressLine1: pickStrOrNull(extended, "addressLine1"),
    addressLine2: pickStrOrNull(extended, "addressLine2"),
    purokSitio: pickStrOrNull(extended, "purokSitio"),
    landmark: pickStrOrNull(extended, "landmark"),
    barangay: pickStrOrNull(extended, "barangay"),
    cityMunicipality: pickStrOrNull(extended, "cityMunicipality"),
    province: pickStrOrNull(extended, "province"),
    postalCode: pickStrOrNull(extended, "postalCode"),

    createdAt: pickStrOrNull(user, "createdAt") ?? pickStrOrNull(root, "createdAt"),
    updatedAt: pickStrOrNull(user, "updatedAt") ?? pickStrOrNull(root, "updatedAt"),
  };
};