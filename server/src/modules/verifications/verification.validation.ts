
import { z } from "zod";

export const verificationQueueQuerySchema = z.object({
  query: z
    .object({
      page: z.coerce.number().int().min(1).default(1),
      limit: z.coerce.number().int().min(1).max(100).default(10),
    })
    .strict(),
});

export const verificationReportIdParamsSchema = z.object({
  params: z
    .object({
      id: z.uuid("Invalid report id").trim(),
    })
    .strict(),
});

export const verifyReportSchema = z.object({
  params: z
    .object({
      id: z.uuid("Invalid report id").trim(),
    })
    .strict(),

  body: z
    .object({
      result: z.enum(["CONFIRMED", "REJECTED", "DUPLICATE"]),

      comment: z
        .string("Comment must be a string")
        .trim()
        .min(1, "Comment cannot be empty")
        .max(1000, "Comment must not exceed 1000 characters")
        .optional(),
    })
    .strict(),
});

export type VerificationQueueQuery = z.infer<typeof verificationQueueQuerySchema>["query"];
export type VerifyReportBody = z.infer<typeof verifyReportSchema>["body"];
export type VerifyReportParams = z.infer<typeof verifyReportSchema>["params"];
export type VerificationReportIdParams = z.infer<typeof verificationReportIdParamsSchema>["params"];