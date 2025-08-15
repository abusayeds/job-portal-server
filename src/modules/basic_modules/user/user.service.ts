/* eslint-disable @typescript-eslint/no-unused-vars */

/* eslint-disable @typescript-eslint/no-explicit-any */
import bcrypt from "bcrypt";

import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import queryBuilder from "../../../builder/queryBuilder";
import { JWT_SECRET_KEY, } from "../../../config";
import AppError from "../../../errors/AppError";
import { JobPostModel } from "../../make_modules/job-post/jobPost.model";
import { candidateModel } from "../candidate/candidate.model";
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
  const { password, confirmPassword, role } = payload;
  if (password !== confirmPassword) {
    throw new AppError(httpStatus.BAD_REQUEST, 'Passwords do not match');
  }
  if (role === "candidate") {
    await UserModel.create({ ...payload, isApprove: true });
    await candidateModel.create(payload)
  } else {
    await UserModel.create(payload);
  }
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
  const verifiedUser = await UserModel.findOneAndUpdate(
    { email: email },
    { isVerify: true },
    { new: true }
  );
  const userObj = (verifiedUser as any).toObject ? (verifiedUser as any).toObject() : verifiedUser;
  const { password: userPassword, ...existuser } = userObj;
  const userSafe = {
    _id: verifiedUser._id,
    email: verifiedUser.email,
    role: verifiedUser.role,
    isCompleted: verifiedUser.isCompleted,
    isActive: verifiedUser.isActive,
    isVerify: verifiedUser.isVerify,
    isApprove: verifiedUser.isApprove
  }

  const token = generateToken({ user: userSafe });

  return {
    user: existuser,
    token
  }


}

const loginDB = async (email: string, password: string) => {
  const user: IUser | null = await UserModel.findOne({ email: email })
    .select("+password -createdAt -updatedAt -__v -isDeleted")
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

  const isAllowedEmployer = user.role === 'employer' && !user.isApprove;
  if (!user.isActive && !isAllowedEmployer) {
    throw new AppError(httpStatus.NOT_FOUND, "Your account is inactive by admin.");
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

const updateUserDB = async (payload: IUser, userId: string) => {

  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }


  const result = await UserModel.findByIdAndUpdate(userId, payload, { new: true });

  return result;
}

const myProfileDB = async (userId: string) => {
  const user: IUser | null = await UserModel.findOne({ _id: userId, isDeleted: false })
    .select("-password -createdAt -updatedAt -__v -isDeleted")
    .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" }).populate({
      path: "candidateInfo",
      // select: "title parsonalWebsite image experience cv educations  maritalStatus gender dateOfBrith biography  nationality  address facebook twitter instagram youtube linkedin  phone jobLevel jobType contactEmail  "
    });
  const myJobs = await JobPostModel.find({
    userId: userId,
    expirationDate: { $exists: true }
  })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "user not found ")
  }

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND,
      "User not found.",
    );
  }

  if (user.role === "candidate") {
    const { candidateInfo, ...userWithoutCandidateInfo } = user.toObject();
    const flattenedUser = { ...userWithoutCandidateInfo, ...candidateInfo, _id: user._id };

    // console.log(flattenedUser);

    return flattenedUser;
  } else {
    return {
      ...user.toObject(),
      totalJobs: myJobs.length,
    }
  }



}
const allUserDB = async (query: Record<string, unknown>, role: string) => {
  const userQuery = new queryBuilder(UserModel.find({ role: role, isDeleted: false }).populate('candidateInfo').select('-password -isVerify'), query)
    .search(['fullName', 'email', 'phone', 'userName'])
    .fields().filter().sort()
  const { totalData } = await userQuery.paginate(UserModel.find({ role: role, isDeleted: false }))
  const user: any = await userQuery.modelQuery.exec()

  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = userQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  const processedUsers = user.map((user: IUser) => {
    const userObj = user.toObject();


    if (userObj.role === "employer") {
      return {
        _id: userObj._id,
        fullName: userObj?.fullName,
        organizationType: userObj?.organizationType || "N/A",
        foundIn: userObj?.foundIn || "N/A",
        address: userObj.address || "N/A",
        email: userObj.email,
        companyName: userObj.companyName || "N/A",
        phone: userObj.phone || "N/A",
        teamSize: userObj.teamSize,
        website: userObj.companyWebsite || "N/A",
        createdAt: userObj.createdAt,
        isActive: userObj.isActive,
        isApprove: userObj.isApprove,
      }
    } else {
      return {
        _id: userObj._id,
        fullName: userObj.fullName,
        dathOfBirth: userObj?.candidateInfo?.dateOfBrith || "N/A",
        nationality: userObj?.candidateInfo?.nationality || "N/A",
        website: userObj?.candidateInfo?.parsonalWebsite || "N/A",
        email: userObj.email,
        phone: userObj.candidateInfo?.phone || "N/A",
        createdAt: userObj.createdAt,
        isActive: userObj.isActive,
        cv: userObj.candidateInfo?.cv,
      }
    }
  });

  return { pagination, user: processedUsers }
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
      result = await UserModel.findByIdAndUpdate(id, { ...payload, isActive: true }, { new: true });
      break;
    default:
      throw new AppError(httpStatus.BAD_REQUEST, "Invalid step");
  }
  return result;
}

const employerAccountManagementDB = async (query: Record<string, unknown>) => {
  const userQuery = new queryBuilder(UserModel.find({ isApprove: false, isCompleted: true, role: "employer", isActive: true }).select('-password -isVerify'), query).fields().filter().sort()
  const { totalData } = await userQuery.paginate(UserModel.find({ isApprove: false, isCompleted: true, role: "employer", isActive: true }))
  const user: any = await userQuery.modelQuery.exec()
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = userQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  const employer = user.map((acc: IUser) => {
    return {
      _id: acc._id,
      fullName: acc?.fullName,
      email: acc?.email,
      logo: acc?.logo,
      role: acc?.role,
      address: acc?.address,
      isApprove: acc?.isApprove,
      foundIn: acc?.foundIn,
      createdAt: acc?.createdAt,

    }
  })
  return {
    pagination, employer
  }

}
const approveEmployerDB = async (query: Record<string, unknown>) => {
  const filters = { isActive: true, isApprove: true, isCompleted: true, role: "employer" };
  const userQuery = new queryBuilder(UserModel.find(filters).select('-password -isVerify'), query).fields().filter().sort()
  const { totalData } = await userQuery.paginate(UserModel.find(filters))
  const user: any = await userQuery.modelQuery.exec()
  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = userQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  const employer = user.map((acc: IUser) => {
    return {
      _id: acc._id,
      fullName: acc?.fullName,
      email: acc?.email,
      logo: acc?.logo,
      address: acc?.address,
      role: acc?.role,
      isApprove: acc?.isApprove,
      createdAt: acc?.createdAt,
      foundIn: acc?.foundIn,
    }
  })
  return {
    pagination, employer
  }

}

const accessEmployeDB = async (payload: IUser, employerId: string) => {
  const employer = await UserModel.findById(employerId).populate('purchasePlan')
  if (employer?.purchasePlan?.planName !== "unlimited_plan") {
    throw new AppError(httpStatus.BAD_REQUEST, ` Access cannot be granted to anyone under the ${employer?.purchasePlan?.planName}`)
  }
  const maxEmploye = await UserModel.find({
    role: "employe",
    purchasePlan: employer.purchasePlan,
  })

  if (maxEmploye.length >= 3) {
    throw new AppError(httpStatus.BAD_REQUEST, "Cannot assign more than 3 employees to this plan.");
  }

  const employe = {
    ...payload,
    userName: payload.email,
    role: "employe",
    isActive: true,
    isApprove: true,
    isVerify: true,
    isCompleted: true,
    purchasePlan: employer.purchasePlan,
    companyId: employerId
  }


  const employeCreate = await UserModel.create(employe)
  return employeCreate
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
  IdentityVerificationDB,
  employerAccountManagementDB,
  approveEmployerDB,
  accessEmployeDB
}




export const userDelete = async (id: string): Promise<void> => {
  await UserModel.findByIdAndUpdate(id, { isDeleted: true });
};




