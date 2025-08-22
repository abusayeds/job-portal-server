/* eslint-disable @typescript-eslint/no-explicit-any */
import { Document, Types } from "mongoose";

export const UserIndustry = [
  'All',
  'Technical-And-Engineering',
  'Business-And-Finance',
  'Sales,-Marketing-And-Customer-Service',
  'Education-And-Training',
  'Legal-And-Government',
  'Professional-Services',
  'Education-And-Facilities-Management',
  'Real-Estate',
  'Retail',
  'Technology',
  'Telecoms',
  'Tourism-And-Leisure',
  'Wholesale-Trade',
  'Agriculture-And-Soft-Commodities',
  'Automotive',
  'Aviation',
  'Chemicals',
  'Conglomerates',
  'Construction-And-Building-Materials',
  'Consumer-Goods',
  'Apparel-And-Textiles',
  'Corporates-Managed-Sponsors',
  'Food',
  'Beverages-And-Tobacco',
  'Healthcare',
  'Hotels',
  'Industrials',
  'LAnd-Transport-And-Logistics',
  'Marine',
  'Media',
  'Metals-And-Mining',
  'Oil-And-Gas',
  'Power-And-Utilities',
  'Other',
];

export type IUserIndustry = typeof UserIndustry[number];

export const UserOrganizationType = [
  "All",
  "Federal Government",
  "County Government",
  "City Government",
  "State Government",
  "Local Government",
  "NGO",
  "Private Company",
  "International Agencies",
  "Airport Authority"
];

export type IUserOrganizationType = typeof UserIndustry[number];

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
  organizationType: IUserOrganizationType,
  industry: IUserIndustry
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
  companyId?: Types.ObjectId
  employmentId?: Types.ObjectId
  step: number
  createdAt?: string
} & Document;

export type IOTP = {
  email: string;
  otp: string;
  expiresAt: Date;
} & Document;
