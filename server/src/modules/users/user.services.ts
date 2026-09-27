import { prisma } from "../../db/prisma";
import { decryptJson, encryptJson } from '../../common/crypto/fieldEncrypto'

type PrivateProfilePayload = {
  addressLine1?: string | null;
  addressLine2?: string | null;
  purokSitio?: string | null;
  landmark?: string | null;
  phoneNumber?: string | null;
};

type PatchMyProfileInput = {
  name?: string;

  barangay?: string | null;
  cityMunicipality?: string | null;
  province?: string | null;
  postalCode?: string | null;

  addressLine1?: string | null;
  addressLine2?: string | null;
  purokSitio?: string | null;
  landmark?: string | null;
  phoneNumber?: string | null;
};

function safeDecryptPrivate(payload: string | null): PrivateProfilePayload {
  if (!payload) return {};
  try {
    return decryptJson<PrivateProfilePayload>(payload);
  } catch {
    return {};
  }
}

export const getMyProfileService = async  (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      role: { select: { name: true } },
      profile: {
        select: {
          avatarUrl: true,
          barangay: true,
          cityMunicipality: true,
          province: true,
          postalCode: true,
          privatePayload: true,
          updatedAt: true,
        },
      },
    },
  });

  if (!user) return null;

  const privateFields = safeDecryptPrivate(user.profile?.privatePayload ?? null);

  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role.name,
    status: user.status,
    createdAt: user.createdAt,

    profile: {
      avatarUrl: user.profile?.avatarUrl ?? null,

      barangay: user.profile?.barangay ?? null,
      cityMunicipality: user.profile?.cityMunicipality ?? null,
      province: user.profile?.province ?? null,
      postalCode: user.profile?.postalCode ?? null,

      addressLine1: privateFields.addressLine1 ?? null,
      addressLine2: privateFields.addressLine2 ?? null,
      purokSitio: privateFields.purokSitio ?? null,
      landmark: privateFields.landmark ?? null,
      phoneNumber: privateFields.phoneNumber ?? null,

      updatedAt: user.profile?.updatedAt ?? null,
    },
  };
}

export const patchMyProfileService = async  (userId: string, input: PatchMyProfileInput) => {
  if (typeof input.name === "string") {
    await prisma.user.update({
      where: { id: userId },
      data: { name: input.name },
    });
  }

  const existing = await prisma.userProfile.findUnique({
    where: { userId },
    select: {
      privatePayload: true,
      avatarUrl: true,
      barangay: true,
      cityMunicipality: true,
      province: true,
      postalCode: true,
    },
  });

  const currentPrivate = safeDecryptPrivate(existing?.privatePayload ?? null);

  const nextPrivate: PrivateProfilePayload = {
    ...currentPrivate,
  };

  if ("addressLine1" in input) nextPrivate.addressLine1 = input.addressLine1 ?? null;
  if ("addressLine2" in input) nextPrivate.addressLine2 = input.addressLine2 ?? null;
  if ("purokSitio" in input) nextPrivate.purokSitio = input.purokSitio ?? null;
  if ("landmark" in input) nextPrivate.landmark = input.landmark ?? null;
  if ("phoneNumber" in input) nextPrivate.phoneNumber = input.phoneNumber ?? null;

  const privatePayload = encryptJson(nextPrivate);

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      barangay: input.barangay ?? null,
      cityMunicipality: input.cityMunicipality ?? null,
      province: input.province ?? null,
      postalCode: input.postalCode ?? null,
      privatePayload,
    },
    update: {
      ...(Object.prototype.hasOwnProperty.call(input, "barangay")
        ? { barangay: input.barangay ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(input, "cityMunicipality")
        ? { cityMunicipality: input.cityMunicipality ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(input, "province")
        ? { province: input.province ?? null }
        : {}),
      ...(Object.prototype.hasOwnProperty.call(input, "postalCode")
        ? { postalCode: input.postalCode ?? null }
        : {}),
      privatePayload,
    },
  });

  return getMyProfileService(userId);
}