/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Types } from "mongoose";

export type IPendingUser = {
  email: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: "user" | "admin";
} & Document;

export type IUser = {
  fullName: string;
  userName: string;
  email: string;
  password: string;
  confirmPassword: string;
  candidateInfo: Types.ObjectId | any
  adminErnings?: number
  role: "admin" | "candidate" | "employer" | "employe";
  logo: string;
  banner: string
  companyName: string;
  about: string;
  organizationType: "All" | "Federal Government" | "County Government" | "City Government" | "State Government" | "Local Government" | "NGO" | "Private Company" | "International Agencies" | "Airport Authority"
  industry: "Technical & Engineering" | "Business & Finance" | "Sales, Marketing & Customer Service" | "Education & Training" | " Legal & Government";
  foundIn: string;
  teamSize: number
  companyWebsite: string
  companyVision: string
  benefits?: string[]

  facebook: string
  twitter: string
  youtube: string
  instagram: string
  linkedin: string

  address: string;
  phone: string;
  contactEmail: string
  isActive: boolean
  isDeleted: boolean;
  isCompleted: boolean;
  isVerify: boolean
  isApprove: boolean
  purchasePlan: Types.ObjectId

  step: number
  createdAt?: string
} & Document;

export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;
