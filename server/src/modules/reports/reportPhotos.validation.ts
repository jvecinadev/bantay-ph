import { z } from "zod";

export const uploadReportPhotosSchema = z.object({
  params: z.object({
    id: z.string().trim().uuid("Invalid report id"),
  }).strict(),
});

export type UploadReportPhotosParams = z.infer<typeof uploadReportPhotosSchema>["params"];