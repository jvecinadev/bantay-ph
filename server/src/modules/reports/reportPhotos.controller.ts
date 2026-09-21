import type { Request, Response } from "express";
import { asyncHandler } from "../../common/errors/asyncHandler";
import type { UploadReportPhotosParams } from "./reportPhotos.validation";
import { uploadReportPhotosService } from "./reportPhotos.services";

export const uploadReportPhotos = asyncHandler(async (req: Request, res: Response) => {
  const { params } = res.locals.validated as { params: UploadReportPhotosParams };

  const files = (req.files as Express.Multer.File[]) ?? [];

  const photos = await uploadReportPhotosService({
    reportId: params.id,
    actor: { id: req.auth!.id, roleName: req.auth!.role.name },
    files,
  });

  res.status(201).json({
    message: "Photos uploaded",
    data: { photos },
  });
});