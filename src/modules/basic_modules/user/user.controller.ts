import { Types } from 'mongoose';
import { IUser } from './user.interface';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, } from "../../../config";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";

import { admin } from "../../../DB";
import { JobPostModel } from "../../make_modules/job-post/jobPost.model";
import { CVItem, TCandidate } from '../candidate/candidate.interface';
import { candidateModel } from '../candidate/candidate.model';
import { INotification } from '../notifications/notification.interface';
import { createNotification } from "../notifications/notification.service";
import { conditionalStepValidation } from "./constant";
import { employerRejectEmail, sendRegistationOtpEmail } from "./sendEmail";
import { UserModel } from "./user.model";
import {
  generateOTP,
  getStoredOTP,
  saveOTP,
  userService,
} from "./user.service";
const registerUser = catchAsync(async (req, res) => {
  const { email } = req.body;
  const isUserRegistered: IUser | null = await UserModel.findOne({ email: email, isVerify: false });
  if (isUserRegistered) {
    await UserModel.findOneAndUpdate(
      { email: email },
      req.body,
      { new: true, upsert: true }
    );
    const otp = generateOTP();
    await saveOTP(email, otp);
    await sendRegistationOtpEmail(otp, email);
    const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Verify your account using the OTP sent to your email.",
      data: {
        token: token
      }
    });
    return
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  const result = await userService.createUserDB(req.body)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Verify OTP to register.",
    data: result
  });
});
const verifyOTP = catchAsync(async (req, res) => {
  const { otp } = req.body;
  const { decoded, }: any = await tokenDecoded(req, res)
  const email = decoded.email;

  const tokenOtp = decoded.otp
  const storedOTP = await getStoredOTP(email);


  if (tokenOtp !== storedOTP) {
    throw new AppError(httpStatus.FORBIDDEN, "Invalid token ")
  }


  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Invalid or expired OTP",
    );
  }
  const result: any = await userService.verifyOtpDB(email)
  const adminId: IUser | null = await UserModel.findOne({ email: admin.email, role: "admin" });
  const adminObjectId = adminId?._id as Types.ObjectId;
  if (result) {
    const payload = {
      userId: new Types.ObjectId(adminObjectId),
      notification: 'Your account has been successfully created.',
    }
    await createNotification(payload as INotification);
  } else {
    throw new AppError(httpStatus.BAD_REQUEST, "Failed to varification");
  }
  sendResponse(res, {
    statusCode: httpStatus.CREATED,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
  const isUserRegistered: IUser | null = await UserModel.findOne({ email: email, isVerify: false });
  if (isUserRegistered) {
    const otp = generateOTP();
    await saveOTP(email, otp);
    await sendRegistationOtpEmail(otp, email);
    const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Verify your account using the OTP sent to your email.",
      data: {
        isVerify: false,
        token: token
      }
    });
    return
  }
  const user = await userService.loginDB(email, password)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Login complete!",
    data: user
  });
});

const forgotPassword = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide an email.",
    );
  }
  const result = await userService.forgotPasswordDB(email)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email. Please check!",
    data: {
      token: result,
    },
  });
},
);

const verifyForgotPasswordOTP = catchAsync(async (req, res) => {
  const { otp } = req.body;
  if (!otp) {
    throw new AppError(httpStatus.BAD_REQUEST, 'otp is required')
  }
  const { decoded }: any = await tokenDecoded(req, res)
  const email = decoded.email;
  const forgot = decoded.forgot
  const tokenOtp = decoded.otp
  const storedOTP = await getStoredOTP(email);
  if (tokenOtp !== storedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "invalid token")
  }
  if (forgot !== "forgot") {
    throw new AppError(httpStatus.BAD_REQUEST,
      "invalid token",
    );
  }
  const token = jwt.sign({ email, verifyForgot: 'verifyForgot', otp: storedOTP }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  await userService.verifyForgotPasswordOtpDB(otp, email)
  return sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP verified successfully.",
    data: {
      token: token
    },
  });
},
);
const resendOTP = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const email = decoded.email;
  const user: IUser | null = await UserModel.findOne({ email: email })
  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found")
  }
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  const result = await userService.resendOtpDB(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A new OTP has been sent to your email.",
    data: {
      token: result
    }
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const verifyForgot = decoded.verifyForgot
  const email = decoded.email
  const tokenOtp = decoded.otp
  const storedOTP = await getStoredOTP(email);
  if (tokenOtp !== storedOTP) {
    throw new AppError(httpStatus.BAD_REQUEST, "invalid token")
  }
  if (verifyForgot !== "verifyForgot") {
    throw new AppError(httpStatus.BAD_REQUEST,
      "invalid token",
    );
  }
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  await userService.resetPasswordDB(req.body, email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Password reset successfully.",
    data: null,
  });


});

const changePassword = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const email = decoded.user.email;

  await userService.changePasswordDB(req.body, email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "You have successfully changed the password.",
    data: null,
  });
},
);

const updateUser = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  const result = await userService.updateUserDB(req.body, userId)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Profile updated.",
    data: result,
  });
});

const myProfile = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  const result = await userService.myProfileDB(userId)

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "profile information retrieved successfully",
    data: result
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const { role } = req.query
  if (!role) {
    throw new AppError(httpStatus.BAD_REQUEST, `please provide role "employer" or "candidate" `)
  }
  const result = await userService.allUserDB(req.query, role as string)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User list retrieved successfully",
    data: result
  });
});
const singleUser = catchAsync(async (req, res) => {
  const { id } = req.params
  const result: IUser = await UserModel.findById(id)
    .select("-password -createdAt -updatedAt -__v -isDeleted")
    .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" }).populate({
      path: "candidateInfo",
      select: "title parsonalWebsite image experience cv educations  maritalStatus gender dateOfBrith biography  nationality  address facebook twitter instagram youtube linkedin  phone jobLevel jobType contactEmail  "
    });
  if (!result) {
    throw new AppError(httpStatus.NOT_FOUND, "User not found");
  }
  const myJobs = await JobPostModel.find({
    userId: id,
    expirationDate: { $exists: true }
  })

  if (result.role === "candidate") {
    const { candidateInfo, ...userWithoutCandidateInfo } = result.toObject();
    const flattenedUser = { ...userWithoutCandidateInfo, ...candidateInfo, _id: result._id };

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get single user retrieved successfully",
      data: flattenedUser
    });
    return
  } else {
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "Get single user retrieved successfully",
      data: {
        ...result?.toObject(),
        totalJobs: myJobs.length,
      }
    });
  }

});
const IdentityVerification = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  const user = await UserModel.findById(userId)

  if (!user) {
    throw new AppError(httpStatus.NOT_FOUND, " user not found ")
  }
  const { step } = req.query;
  if (!step) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide the 'step' query parameter for identity verification.");
  }


  conditionalStepValidation
  const result: IUser = await userService.IdentityVerificationDB(userId, req.body, step as string)
  if (!result.isCompleted) {
    await UserModel.findByIdAndUpdate(userId, { step: step }, { new: true })
  }
  let message
  if (result.isCompleted) {
    message = "Profile updated successfully";
  } else if (step === "4") {
    message = "Profile completed, please wait for admin approval";
    const result = await UserModel.findByIdAndUpdate(userId, {
      isCompleted: true,
      step: step
    })
    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: message,
      data: result
    });
    return
  } else {
    message = `Step ${step} Verified`;
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: result
  });




}
)

const handleStatus = catchAsync(async (req, res) => {
  const payload: IUser = req.body;
  const { userId } = req.params


  const isUserExist: IUser | null = await UserModel.findById(userId)


  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found ')
  }
  if (payload.isApprove === false && payload.isActive === false) {
    if (!req.body.description) {
      throw new AppError(httpStatus.BAD_REQUEST, "Please provide a reason for rejection.")
    }
    await employerRejectEmail(req.body.title, req.body.description, isUserExist.fullName, isUserExist.email)
  }

  const result = await UserModel.findByIdAndUpdate(
    userId, { ...payload }, { new: true }
  )

  let message
  if (payload.isApprove === false && payload.isActive === false) {
    message = "The user is rejected.";
  } else if (payload.isActive === false) {
    message = "The user is deactivated.";
  } else if (payload.isApprove) {
    message = "The user is approved.";
  } else if (payload.isActive) {
    message = "The user is activated.";
  }
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: message,
    data: result
  });
});

const employerAccountManagement = catchAsync(async (req, res) => {
  const employerAccManagement = await userService.employerAccountManagementDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employer list  retrieved successfully",
    data: employerAccManagement
  });
});
const approveEmployer = catchAsync(async (req, res) => {
  const employerAccManagement = await userService.approveEmployerDB(req.query)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Employer list  retrieved successfully",
    data: employerAccManagement
  });
});
const candidateCvUpdate = catchAsync(async (req, res) => {
  const { pull } = req.query;
  const { decoded }: any = await tokenDecoded(req, res);
  const email = decoded.user.email;
  const payload = req.body as TCandidate;

  if (pull) {
    const updateUser = await candidateModel.findOneAndUpdate(
      { email: email },
      { $pull: { cv: { _id: new Types.ObjectId(pull as string) } } },
      { new: true }
    );

    if (!updateUser) {
      throw new AppError(httpStatus.NOT_FOUND, "Candidate not found.");
    }

    sendResponse(res, {
      statusCode: httpStatus.OK,
      success: true,
      message: "CV removed successfully",
      data: updateUser
    });
    return;
  }

  if (!payload.cv || !Array.isArray(payload.cv) || payload.cv.length === 0) {
    throw new AppError(httpStatus.BAD_REQUEST, "CV is required and must be an array.");
  }

  payload.cv.forEach((cvItem: CVItem) => {
    if (typeof cvItem !== 'object' || !cvItem.name || !cvItem.file) {
      throw new AppError(httpStatus.BAD_REQUEST, "Each CV item must be an object with 'name' and 'file' properties.");
    }
    if (!cvItem.file.startsWith('/images/')) {
      throw new AppError(httpStatus.BAD_REQUEST, "Each CV file path must start with '/images/'");
    }
    if (typeof cvItem.name !== 'string' || cvItem.name.trim() === '') {
      throw new AppError(httpStatus.BAD_REQUEST, "Each CV 'name' must be a valid non-empty string.");
    }
  });


  const updateUser = await candidateModel.findOneAndUpdate(
    { email: email },
    { $addToSet: { cv: { $each: payload.cv } } },
    { new: true }
  );

  if (!updateUser) {
    throw new AppError(httpStatus.NOT_FOUND, "Candidate not found.");
  }

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "CV updated successfully",
    data: updateUser
  });
});

const accessEmploye = catchAsync(async (req, res) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const id = decoded.user._id;
  const employeAccount = await userService.accessEmployeDB(req.body, id)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "An employee has been added.",
    data: employeAccount
  });
});


export const userController = {
  registerUser,
  loginUser,
  forgotPassword,
  verifyForgotPasswordOTP,
  resendOTP,
  resetPassword,
  changePassword,
  updateUser,
  myProfile,
  getAllUsers,
  verifyOTP,
  IdentityVerification,
  singleUser,
  employerAccountManagement,
  approveEmployer,
  handleStatus,
  candidateCvUpdate,
  accessEmploye
}






