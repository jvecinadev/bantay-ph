import { prisma } from "../../db/prisma";
import { v2 as cloudinary } from "cloudinary";

export const uploadMyAvatarService = async (userId: string, file: Express.Multer.File) => {
  const folder = `bantayph/avatars/${userId}`;
  const publicId = "avatar";

  const uploaded = await new Promise<{ secure_url: string; public_id: string }>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: publicId,
        overwrite: true,
        resource_type: "image",
      },
      (err, result) => {
        if (err || !result) return reject(err ?? new Error("Upload failed"));
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    stream.end(file.buffer);
  });

  await prisma.userProfile.upsert({
    where: { userId },
    create: {
      userId,
      avatarUrl: uploaded.secure_url,
      avatarProvider: "cloudinary",
      avatarProviderFileId: uploaded.public_id,
    },
    update: {
      avatarUrl: uploaded.secure_url,
      avatarProvider: "cloudinary",
      avatarProviderFileId: uploaded.public_id,
    },
  });

  return { avatarUrl: uploaded.secure_url };
}