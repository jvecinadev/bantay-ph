import multer from "multer";
import { HttpError } from "../common/errors/httpErrors";

const storage = multer.memoryStorage();

const fileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
  const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
  if (!ok) return cb(new HttpError(400, "Invalid file type", { code: "INVALID_FILE_TYPE" }));
  cb(null, true);
};

export const uploadReportPhotos = multer({
  storage,
  fileFilter,
  limits: {
    files: 3, 
    fileSize: 5 * 1024 * 1024, 
  },
}).array("photos", 3);