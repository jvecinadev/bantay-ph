// src/modules/users/users.schemas.ts
import { z } from "zod";

export const USER_THEMES = ["light", "dark", "system"] as const;

export const patchMyProfileSchema = z.object({
  body: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, "Name cannot be empty")
        .max(100, "Name must not exceed 100 characters")
        .optional(),


      barangay: z.string().trim().max(100, "Barangay too long").optional().nullable(),
      cityMunicipality: z
        .string()
        .trim()
        .max(100, "City/Municipality too long")
        .optional()
        .nullable(),
      province: z.string().trim().max(100, "Province too long").optional().nullable(),
      postalCode: z.string().trim().max(20, "Postal code too long").optional().nullable(),

      addressLine1: z.string().trim().max(255, "Address line 1 too long").optional().nullable(),
      addressLine2: z.string().trim().max(255, "Address line 2 too long").optional().nullable(),
      purokSitio: z.string().trim().max(100, "Purok/Sitio too long").optional().nullable(),
      landmark: z.string().trim().max(255, "Landmark too long").optional().nullable(),
      phoneNumber: z
        .string()
        .trim()
        .max(30, "Phone number too long")
        .optional()
        .nullable(),
    })
    .strict(),
});

export const patchMySettingsSchema = z.object({
  body: z
    .object({
      theme: z.enum(USER_THEMES).optional(),

      notifications: z
        .object({
          email: z.boolean().optional(),
          sms: z.boolean().optional(),
        })
        .strict()
        .optional(),

      privacy: z
        .object({
          showNameInFeed: z.boolean().optional(),
        })
        .strict()
        .optional(),
    })
    .strict(),
});

export const getUserPublicProfileSchema = z.object({
  params: z
    .object({
      id: z.string().trim().uuid("Invalid user id"),
    })
    .strict(),
});

export type GetUserPublicProfileParams = z.infer<typeof getUserPublicProfileSchema>["params"];
export type PatchMyProfileBody = z.infer<typeof patchMyProfileSchema>["body"];
export type PatchMySettingsBody = z.infer<typeof patchMySettingsSchema>["body"];