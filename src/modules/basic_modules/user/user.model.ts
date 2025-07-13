import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import { IOTP, IUser } from "./user.interface";

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, trim: true, required: true },
    userName: { type: String, trim: true, required: true, unique: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 3,
      set: (v: string) => bcrypt.hashSync(v, bcrypt.genSaltSync(12)),
      select: false,
    },
    candidateInfo: { type: Schema.Types.ObjectId, ref: "Candidate", required: false },
    role: {
      type: String,
      enum: ["admin", "candidate", "employer", "employe"],
      required: true,
      trim: true
    },
    adminErnings: { type: Number, },
    //***** employers stpe1 *******//
    logo: { type: String, trim: true },
    banner: { type: String, trim: true },
    companyName: { type: String, trim: true },
    about: { type: String, trim: true },

    //***** employers stpe2 *******//
    organizationType: {
      type: String,
      enum: ["All", "Federal Government", "County Government", "City Government", "State Government", "Local Government", "NGO", "Private Company", "International Agencies", "Airport Authority"],
      required: false,
      trim: true
    },
    industry: { type: String, enam: ['Technical & Engineering', "Business & Finance", "Sales, Marketing & Customer Service", "Education & Training", "Legal & Government"], trim: true },
    foundIn: { type: String, trim: true },
    teamSize: { type: Number },
    companyWebsite: { type: String, trim: true },
    companyVision: { type: String, trim: true },
    benefits: { type: [String], trim: true, },

    //***** employers stpe3 *******//
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    youtube: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },



    //***** employers stpe4 *bbbbbbbb******//
    address: { type: String, trim: true, },
    phone: { type: String, trim: true, },
    contactEmail: { type: String, trim: true },
    isCompleted: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
    isApprove: { type: Boolean, default: false },

    isDeleted: { type: Boolean, default: false },
    isVerify: { type: Boolean, default: false },
    purchasePlan: {
      type: Schema.Types.ObjectId,
      ref: "PurchasePlanModel"
    },

    step: {
      type: Number, default: 0
    }
  },
  { timestamps: true }
);



export const UserModel = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);
const OTPSchema = new Schema<IOTP>({
  email: { type: String, required: true, trim: true },
  otp: { type: String, required: true, trim: true },
  expiresAt: { type: Date, required: true },
});

export const OTPModel = mongoose.model<IOTP>("OTP", OTPSchema);
