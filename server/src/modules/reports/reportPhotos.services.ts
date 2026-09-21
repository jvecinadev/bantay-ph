import streamifier from "streamifier";
import { prisma } from "../../db/prisma";
import { HttpError } from "../../common/errors/httpErrors";
import { cloudinary } from "../../common/storage/cloudinary";

type Actor = { id: string; roleName: string };

function uploadBufferToCloudinary(args: { buffer: Buffer; folder: string }) {
  const { buffer, folder } = args;

  return new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
}

export const uploadReportPhotosService = async (args: {
  reportId: string;
  actor: Actor;
  files: Express.Multer.File[];
}) => {
  const { reportId, actor, files } = args;

  if (!files || files.length === 0) {
    throw new HttpError(400, "No photos uploaded", { code: "NO_PHOTOS" });
  }

  return prisma.$transaction(async (tx) => {
    const report = await tx.report.findUnique({
      where: { id: reportId },
      select: { id: true, reporterId: true, status: true },
    });

    if (!report) throw new HttpError(404, "Report not found", { code: "REPORT_NOT_FOUND" });

    if (report.reporterId !== actor.id) {
      throw new HttpError(403, "Forbidden", { code: "REPORT_FORBIDDEN" });
    }

    if (report.status !== "REPORTED") {
      throw new HttpError(409, "You can only upload photos while the report is REPORTED", {
        code: "PHOTOS_UPLOAD_NOT_ALLOWED",
        details: { currentStatus: report.status },
      });
    }

    const existingCount = await tx.reportPhoto.count({ where: { reportId } });
    if (existingCount + files.length > 3) {
      throw new HttpError(409, "Maximum of 3 photos per report", {
        code: "PHOTO_LIMIT_EXCEEDED",
        details: { existingCount, uploading: files.length, max: 3 },
      });
    }

    const folder = `bantayph/reports/${reportId}`;
    const uploads = await Promise.all(
      files.map((f) => uploadBufferToCloudinary({ buffer: f.buffer, folder }))
    );

    const created = await Promise.all(
      uploads.map((u) =>
        tx.reportPhoto.create({
          data: {
            reportId,
            url: u.secure_url,
            provider: "CLOUDINARY",
            providerFileId: u.public_id,
          },
          select: {
            id: true,
            url: true,
            provider: true,
            providerFileId: true,
            createdAt: true,
          },
        })
      )
    );

    await tx.auditLog.create({
      data: {
        userId: actor.id,
        action: "REPORT_PHOTOS_UPLOADED",
        entityType: "REPORT",
        entityId: reportId,
        details: JSON.stringify({ count: created.length }),
      },
    });

    return created;
  });
};