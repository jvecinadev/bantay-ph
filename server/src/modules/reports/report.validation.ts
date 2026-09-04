import { z } from "zod";

export const REPORT_CATEGORIES = [
  "ROAD_DAMAGE",
  "FLOODING",
  "GARBAGE",
  "STREETLIGHT",
  "DRAINAGE",
  "FALLEN_TREE",
  "WATER",
  "OTHER",
] as const;

export const REPORT_STATUSES = [
  "REPORTED",
  "UNDER_VERIFICATION",
  "VERIFIED",
  "REJECTED",
  "ASSIGNED",
  "IN_PROGRESS",
  "RESOLVED",
  "DUPLICATE",
] as const;

export const createReportSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(150, "Title must not exceed 150 characters"),

      description: z
        .string()
        .trim()
        .min(1, "Description cannot be empty"),

      category: z.enum(REPORT_CATEGORIES, {
        error: "Category is required and must be valid",
      }),

      latitude: z.coerce
        .number({
          error: "Latitude must be a valid number",
        })
        .min(-90, "Latitude must be between -90 and 90")
        .max(90, "Latitude must be between -90 and 90"),

      longitude: z.coerce
        .number({
          error: "Longitude must be a valid number",
        })
        .min(-180, "Longitude must be between -180 and 180")
        .max(180, "Longitude must be between -180 and 180"),
    })
    .strict(),
});


export const getMyReportSchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),

      limit: z.coerce.number().int().min(1).max(100).default(10),

      category: z.enum(REPORT_CATEGORIES).optional(),

      status: z.enum(REPORT_STATUSES).optional(),
    })
    .strict(),
});


export const getReportByIdSchema = z.object({
  params: z
    .object({
      id: z
        .string()
        .trim()
        .uuid("Invalid report id"),
    })
    .strict(),
});


export type CreateReportBody = z.infer<
  typeof createReportSchema
>["body"];

export type GetUserReportQuery = z.infer<
  typeof getMyReportSchema
>["query"];

export type GetReportByIdParams = z.infer<
  typeof getReportByIdSchema
>["params"];