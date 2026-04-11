import { v2 as cloudinary } from "cloudinary";
import httpStatus from "http-status";
import path from "path";
import streamifier from "streamifier";
import AppError from "../errors/AppError";
import catchAsync from "../utils/catchAsync";
import sendResponse from "../utils/sendResponse";
import { cloud_name, api_secret, api_key,  } from "../config";
import { Express } from "express"; 
cloudinary.config({
  cloud_name,
  api_key,
  api_secret,
});

const getResourceType = (
  mimetype: string
): "image" | "video" | "raw" | "auto" => {
  if (mimetype.startsWith("image/")) return "image";
  if (mimetype.startsWith("video/")) return "video";
  if (mimetype.startsWith("audio/")) return "video";
  return "raw";
};

const uploadToCloudinary = (
  file: Express.Multer.File
): Promise<{ secure_url: string; public_id: string }> => {
  return new Promise((resolve, reject) => {
    const resource_type = getResourceType(file.mimetype);
    const ext = path.extname(file.originalname).toLowerCase();
    const baseName = path.basename(file.originalname, ext).replace(/\s+/g, "_");
    const public_id = `${Date.now()}-${baseName}`;

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type,
        folder: "uploads",
        public_id,
      },
      (error, result) => {
        if (error || !result) return reject(error);
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      }
    );

    streamifier.createReadStream(file.buffer).pipe(uploadStream);
  });
};

export const uploadFile = catchAsync(async (req, res) => {
  if (!req.file) {
    throw new AppError(httpStatus.BAD_REQUEST, "No uploaded file");
  }

  const { secure_url,  } = await uploadToCloudinary(req.file);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "File uploaded",
    data: {
      path: secure_url,
      url: secure_url,
    },
  });
});