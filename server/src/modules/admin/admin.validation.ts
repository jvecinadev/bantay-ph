
import { z } from "zod";

export const STATUS = [
    "ACTIVE",
    "INACTIVE"
] as const

export const ROLE = [
    "RESIDENT",
    "VALIDATOR",
    "BARANGAY_STAFF",
    "ADMIN"
]


export const listUserSchema = z.object({
    query: z.object({
        page: z.coerce.number().int().min(1).default(1),
        limit: z.coerce.number().int().min(1).max(100).default(10),
        search: z.string().trim().optional(),
        role: z.enum(ROLE).optional(),
        status: z.enum(STATUS).optional(),
    })
})

export const updateUserRoleSchema = z.object({
    params: z.object({
        id: z.uuid().trim()
    }),
    body: z.object({
        roleName: z.enum(ROLE)
    })
})

export const updateUserStatusSchema = z.object({
    params: z.object({
        id: z.uuid().trim()
    }),
    body: z.object({
        status: z.enum(STATUS)
    })
})

export const listAuditLogsSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),

      action: z.string().trim().min(1).optional(),
      entityType: z.string().trim().min(1).optional(),
      entityId: z.string().trim().min(1).optional(),
      userId: z.string().trim().min(1).optional(), // ✅ optional() must be called
    })
    .strict(),
});

export type ListUsersQuery = z.infer<typeof listUserSchema>["query"]
export type UpdateUserRole = z.infer<typeof updateUserRoleSchema>
export type UpdateUserStatus = z.infer<typeof updateUserStatusSchema>
export type ListAuditLogsQuery = z.infer<typeof listAuditLogsSchema>["query"]