import { prisma } from "../../db/prisma";
import { decryptJson } from "../../common/crypto/fieldEncrypto";

type PrivateProfilePayload = {
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

export const getAdminUserProfileService = async (targetUserId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      role: { select: { id: true, name: true } },
      profile: {
        select: {
          avatarUrl: true,
          barangay: true,
          cityMunicipality: true,
          province: true,
          postalCode: true,
          privatePayload: true,
          createdAt: true,
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
    status: user.status,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,

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

      createdAt: user.profile?.createdAt ?? null,
      updatedAt: user.profile?.updatedAt ?? null,
    },
  };
}