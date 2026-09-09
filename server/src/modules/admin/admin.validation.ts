
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

export type ListUsersQuery = z.infer<typeof listUserSchema>["query"]