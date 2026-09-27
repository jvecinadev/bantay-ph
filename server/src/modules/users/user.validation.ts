import { z } from "zod";

export const patchMyProfileSchema = z
  .object({
    name: z.string().trim().min(1).max(100).optional(),

    barangay: z.string().trim().max(100).optional().nullable(),
    cityMunicipality: z.string().trim().max(100).optional().nullable(),
    province: z.string().trim().max(100).optional().nullable(),
    postalCode: z.string().trim().max(20).optional().nullable(),

    addressLine1: z.string().trim().max(255).optional().nullable(),
    addressLine2: z.string().trim().max(255).optional().nullable(),
    purokSitio: z.string().trim().max(100).optional().nullable(),
    landmark: z.string().trim().max(255).optional().nullable(),
    phoneNumber: z.string().trim().max(30).optional().nullable(),
  })
  .strict();

export const patchMySettingsSchema = z
  .object({
    theme: z.enum(["light", "dark", "system"]).optional(),
    notifications: z
      .object({
        email: z.boolean().optional(),
        sms: z.boolean().optional(),
      })
      .optional(),
    privacy: z
      .object({
        showNameInFeed: z.boolean().optional(),
      })
      .optional(),
  })
  .strict();