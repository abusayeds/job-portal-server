/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";

import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import queryBuilder from "../../../builder/queryBuilder";
import { JWT_SECRET_KEY, } from "../../../config";
import AppError from "../../../errors/AppError";
import { forgotOtpEmail, resendOtpEmail, sendRegistationOtpEmail } from "./sendEmail";
import { IUser, } from "./user.interface";
import { OTPModel, UserModel } from "./user.model";
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, JWT_SECRET_KEY as string, { expiresIn: "7d" });
};
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, 12);
};
export const getStoredOTP = async (email: string): Promise<string | null> => {
  const otpRecord = await OTPModel.findOne({ email });
  return otpRecord ? otpRecord.otp : null;
};
export const generateOTP = (): string => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log(otp);
  return otp
};
export const findUserByEmail = async (email: string): Promise<IUser | null> => {
  return UserModel.findOne({ email }).select('+password');
};

export const findUserById = async (id: string): Promise<IUser | null> => {
  return UserModel.findById(id);
};
export const saveOTP = async (email: string, otp: string): Promise<void> => {
  await OTPModel.findOneAndUpdate(
    { email },
    { otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) },
    { upsert: true, new: true },
  );
};

const createUserDB = async (payload: IUser) => {
  const isUserRegistered: IUser | null = await UserModel.findOne({ email: payload.email, isVerify: true });
  if (isUserRegistered) {
    throw new AppError(httpStatus.CONFLICT, "Already have an account");
  }
  const { password, confirmPassword } = payload;
  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }
  await UserModel.create(payload);
  const email = payload.email;
  const otp = generateOTP();
  await saveOTP(email, otp);
  await sendRegistationOtpEmail(otp, email);
  const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
  return {
    token: token
  };
}





const verifyOtpDB = async (email: string) => {
  const user: IUser | null = await UserModel.findOne({ email: email })
    .select("-password -createdAt -updatedAt -__v -isDeleted")
    .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }
  if (user.isVerify) {
    throw new AppError(httpStatus.BAD_REQUEST, "Alredy verified")
  }
  await UserModel.findOneAndUpdate(
    { email: email },
    { isVerify: true },
    { new: true }
  );
  const userObj = (user as any).toObject ? (user as any).toObject() : user;
  const { password: userPassword, ...existuser } = userObj;
  const userSafe = {
    _id: user._id,
    email: user.email,
    role: user.role,
    isCompleted: user.isCompleted,
    isActive: user.isActive,
    isVerify: user.isVerify,
    isApprove: user.isApprove
  }

  const token = generateToken({ user: userSafe });

  return {
    user: existuser,
    token
  }


}

const loginDB = async (email: string, password: string) => {
  const user: IUser | null = await UserModel.findOne({ email: email })
    .select("-password -createdAt -updatedAt -__v -isDeleted")
    .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "This account does not exist.",
    );
  }
  if (user.isDeleted) {
    throw new AppError(httpStatus.NOT_FOUND,
      "your account is deleted by admin.",
    );
  }

  if (!user.isActive) {
    throw new AppError(httpStatus.NOT_FOUND,
      "your account is deactive by admin.",
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password as string,
  );

  if (!isPasswordValid) {
    throw new AppError(httpStatus.UNAUTHORIZED,
      "Wrong password!",
    );
  }
  const userObj = (user as any).toObject ? (user as any).toObject() : user;
  const { password: userPassword, ...existuser } = userObj;
  const userSafe = {
    _id: user._id,
    email: user.email,
    role: user.role,
    isCompleted: user.isCompleted,
    isActive: user.isActive,
    isVerify: user.isVerify,
    isApprove: user.isApprove
  }

  const token = generateToken({ user: userSafe });

  return {
    user: existuser,
    token
  }
}

const forgotPasswordDB = async (email: string) => {
  const user = await UserModel.findOne({ email: email });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "This account does not exist.",
    );
  }
  const otp = generateOTP();
  await saveOTP(email, otp);
  await forgotOtpEmail(otp, email)
  const token = jwt.sign({ email, forgot: 'forgot', otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
  return token
}
const verifyForgotPasswordOtpDB = async (otp: string, email: string) => {
  const otpRecord = await OTPModel.findOne({ email });
  if (!otpRecord) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found!",
    );
  }

  const currentTime = new Date();
  if (otpRecord.expiresAt < currentTime) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "OTP has expired",
    );
  }
  if (otpRecord.otp !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Wrong OTP",
    );
  }

}

const resendOtpDB = async (email: string) => {
  const newOTP = generateOTP();
  await saveOTP(email, newOTP);
  await resendOtpEmail(newOTP, email,);
  const token = jwt.sign({ email, forgot: 'forgot', otp: newOTP }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
  return token
}

const resetPasswordDB = async (payload: any, email: string) => {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }
  if (payload.confirmPassword !== payload.password) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }
  await UserModel.findOneAndUpdate({ email: email }, payload, { new: true });
}

const changePasswordDB = async (payload: any, email: string) => {
  const { oldPassword, newPassword, confirmPassword } = payload
  if (!oldPassword || !newPassword || !confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide oldPassword, newPassword, and confirmPassword.",
    );
  }
  const user = await findUserByEmail(email);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }
  const isMatch = await bcrypt.compare(oldPassword, user.password as string);
  if (!isMatch) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Old password is incorrect.",
    );
  }

  if (newPassword !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "New password and confirm password do not match.",
    );
  }
  await UserModel.findOneAndUpdate({ email: email }, { password: newPassword }, { new: true });
}

const updateUserDB = async (payload: IUser, file: any, userId: string) => {

  const user = await findUserById(userId);
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }
  const updateData: any = {};
  if (file) {
    const imagePath = `public\\images\\${file.filename}`;
    const publicFileURL = `/images/${file.filename}`;
    updateData.image = {
      path: imagePath,
      publicFileURL: publicFileURL,
    };
  }
  const result = await UserModel.findByIdAndUpdate(userId, { ...payload, ...updateData }, { new: true });
  const updateUser = { ...result.toObject ? result.toObject() : result };
  delete updateUser.password;
  delete updateUser.isVerify;

  return updateUser;
}

const myProfileDB = async (userId: string) => {
  const user: IUser | null = await UserModel.findById(userId)
    .select("-password -createdAt -updatedAt -__v -isDeleted")
    .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" });
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }
  return user
}
const allUserDB = async (query: Record<string, unknown>,) => {
  const userQuery = new queryBuilder(UserModel.find({ role: "user" }).select('-password -isVerify'), query).sort()
  const { totalData } = await userQuery.paginate(UserModel.find({ role: "user" }))
  const user = await userQuery.modelQuery.exec()
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = userQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  return { pagination, user, };
}

const IdentityVerificationDB = async (id: string, payload: IUser, step: string) => {
  if (payload.logo && !payload.logo.startsWith('/images/')) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
  }
  if (payload.banner && !payload.banner.startsWith('/images/')) {
    throw new AppError(httpStatus.BAD_REQUEST, "Invalid banner path");
  }
  let result;
  switch (step) {
    case '1':
    case '2':
    case '3':
    case '4':
      result = await UserModel.findByIdAndUpdate(id, { ...payload }, { new: true });
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid step");
  }
  return result;
}


export const userService = {
  createUserDB,
  verifyOtpDB,
  loginDB,
  forgotPasswordDB,
  verifyForgotPasswordOtpDB,
  resendOtpDB,
  resetPasswordDB,
  changePasswordDB,
  updateUserDB,
  myProfileDB,
  allUserDB,
  IdentityVerificationDB
}




export const userDelete = async (id: string): Promise<void> => {
  await UserModel.findByIdAndUpdate(id, { isDeleted: true });
};




