import { v2 as cloudinary, UploadApiResponse, UploadApiOptions } from 'cloudinary'
import { CloudinaryStorage } from 'multer-storage-cloudinary'
import multer, { Multer } from 'multer'
import dotenv from 'dotenv'
import { Request, Response, NextFunction } from 'express'

dotenv.config()

const cloudinaryConfig: UploadApiOptions = {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || '',
  api_key: process.env.CLOUDINARY_API_KEY || '',
  api_secret: process.env.CLOUDINARY_API_SECRET || ''
};

cloudinary.config(cloudinaryConfig);

const storageConfig = {
  cloudinary,
  params: {
    folder: "e-commerce",
    allowed_formats: ["jpeg", "png", "jpg", "pdf"],
  },
};

const storage = new CloudinaryStorage(storageConfig);

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (!["image/png", "image/jpg", "image/jpeg", "application/pdf"].includes(file.mimetype)) {
    return cb(new Error("File format is not supported"));
  }
  return cb(null, true);
};

const upload: Multer = multer({ storage, fileFilter });

export const uploadFiles = (req: Request, res: Response, next: NextFunction) => {
  upload.any()(req, res, (err: any) => {
    if (err) {
      console.error(err);
      if (err.message === "File format is not supported") {
        return res.status(400).json({ error: 'Selected file format is not supported' });
      }
      return res.status(500).json({ error: 'An error occurred during file upload' });
    } else {
      console.log("Files uploaded to cloudinary");
      return next();
    }
  });
};

export const deleteFiles = async (publicIds: string[]): Promise<{ publicId: string; success: boolean; result?: UploadApiResponse; error?: any }[]> => {
  const results: { publicId: string; success: boolean; result?: UploadApiResponse; error?: any }[] = [];

  for (const publicId of publicIds) {
    try {
      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        cloudinary.uploader.destroy(publicId, (error, result) => {
          if (error) reject(error);
          else resolve(result);
        });
      });
      results.push({ publicId, success: true, result });
      console.log(`Deleted successfully: ${publicId}`);
    } catch (error) {
      results.push({ publicId, success: false, error });
      console.error(`Failed to delete: ${publicId}`, error);
    }
  }

  return results; // Contains information about each deletion, success or failure
};
