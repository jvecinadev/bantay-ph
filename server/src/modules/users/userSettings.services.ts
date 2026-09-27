import { prisma } from "../../db/prisma";
import { decryptJson, encryptJson } from "../../common/crypto/fieldEncrypto"

export type UserSettingsDTO = {
  theme?: "light" | "dark" | "system";
  notifications?: { email?: boolean; sms?: boolean };
  privacy?: { showNameInFeed?: boolean };
};

const DEFAULT_SETTINGS: Required<UserSettingsDTO> = {
  theme: "system",
  notifications: { email: true, sms: false },
  privacy: { showNameInFeed: true },
};

function safeDecrypt(payload: string | null): UserSettingsDTO {
  if (!payload) return DEFAULT_SETTINGS;
  try {
    return { ...DEFAULT_SETTINGS, ...decryptJson<UserSettingsDTO>(payload) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function getMySettingsService(userId: string) {
  const row = await prisma.userSettings.findUnique({
    where: { userId },
    select: { payload: true, updatedAt: true },
  });

  if (!row) {
    return { settings: DEFAULT_SETTINGS, updatedAt: null, isDefault: true };
  }

  return {
    settings: safeDecrypt(row.payload),
    updatedAt: row.updatedAt.toISOString(),
    isDefault: false,
  };
}

export async function patchMySettingsService(userId: string, patch: UserSettingsDTO) {
  const currentRow = await prisma.userSettings.findUnique({
    where: { userId },
    select: { payload: true },
  });

  const current = safeDecrypt(currentRow?.payload ?? null);

  const next: UserSettingsDTO = {
    ...current,
    ...patch,
    notifications: { ...current.notifications, ...patch.notifications },
    privacy: { ...current.privacy, ...patch.privacy },
  };

  const payload = encryptJson(next);

  const saved = await prisma.userSettings.upsert({
    where: { userId },
    create: { userId, payload },
    update: { payload },
    select: { updatedAt: true },
  });

  return { settings: next, updatedAt: saved.updatedAt.toISOString() };
}