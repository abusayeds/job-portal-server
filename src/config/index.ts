import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.join((process.cwd(), ".env")) });
<<<<<<< HEAD
export const PORT = process.env.JOB_PORTAL_PORT || 5000;
export const IP = process.env.JOB_PORTAL_IP
export const DATABASE_URL = process.env.JOB_PORTAL_DATABASE_URL;
export const JWT_SECRET_KEY = process.env.JOB_PORTAL_JWT_SECRET_KEY;
export const Nodemailer_GMAIL = process.env.JOB_PORTAL_Nodemailer_GMAIL;
export const Nodemailer_GMAIL_PASSWORD = process.env.JOB_PORTAL_Nodemailer_GMAIL_PASSWORD;
export const UPLOAD_FOLDER = process.env.JOB_PORTAL_UPLOAD_FOLDER;
export const max_file_size = Number(process.env.JOB_PORTAL_max_file_size);
export const NODE_ENV = process.env.JOB_PORTAL_NODE_ENV;
=======
export const PORT = process.env.PORT || 5000;
export const DATABASE_URL = process.env.DATABASE_URL;
export const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
export const Nodemailer_GMAIL = process.env.Nodemailer_GMAIL;
export const Nodemailer_GMAIL_PASSWORD = process.env.Nodemailer_GMAIL_PASSWORD;
export const UPLOAD_FOLDER = process.env.UPLOAD_FOLDER;
export const max_file_size = Number(process.env.max_file_size);
export const NODE_ENV = process.env.NODE_ENV;
>>>>>>> 6347cc25eaf8c0f1c25123295092551134662053

export const STRIPE_WEBHOOK_SECRET = process.env.JOB_PORTAL_STRIPE_WEBHOOK_SECRET;
export const STRIPE_SECRET_KEY = process.env.JOB_PORTAL_STRIPE_SECRET_KEY;

export const cloud_name = process.env.JOB_PORTAL_CLOUDINARY_CLOUD_NAME
export const api_key = process.env.JOB_PORTAL_CLOUDINARY_API_KEY
export const api_secret = process.env.JOB_PORTAL_CLOUDINARY_API_SECRET
