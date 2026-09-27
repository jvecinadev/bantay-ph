import multer, { FileFilterCallback } from "multer";
import { Request } from "express";

const storage = multer.memoryStorage();

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, 
  fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
    const ok = ["image/jpeg", "image/png", "image/webp"].includes(file.mimetype);
    
    if (ok) {
      cb(null, true); 
    } else {
      cb(new Error("Invalid file type"));
    }
  },
}).single("avatar");