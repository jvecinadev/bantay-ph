import { z } from "zod";
import { REPORT_CATEGORIES } from "./report.validation";

export const reportIdParamsSchema = z.object({
  params: z.object({
    id: z.string("Report id is required").trim().uuid("Invalid report id"),
  }).strict(),
});

export const feedQuerySchema = z.object({
  query: z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    category: z.enum(REPORT_CATEGORIES).optional(),
  }).strict(),
});

export const addCommentSchema = z.object({
  params: z.object({
    id: z.string("Report id is required").trim().uuid("Invalid report id"),
  }).strict(),
  body: z.object({
    comment: z.string("Comment is required")
      .trim()
      .min(1, "Comment cannot be empty")
      .max(1000, "Comment must not exceed 1000 characters"),
  }).strict(),
});

export type ReportIdParams = z.infer<typeof reportIdParamsSchema>["params"];
export type FeedQuery = z.infer<typeof feedQuerySchema>["query"];
export type AddCommentBody = z.infer<typeof addCommentSchema>["body"];