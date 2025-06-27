/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY, } from "../../../config";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { emitNotification } from "../../../utils/socket";

import { IUser } from "./user.interface";
import { UserModel } from "./user.model";
import {
  getStoredOTP,
  userService,
} from "./user.service";
const registerUser = catchAsync(async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "email is required.",
    );
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
  const { decoded }: any = await tokenDecoded(req, res)
  const email = decoded.email;
  const storedOTP = await getStoredOTP(email);
  if (!storedOTP || storedOTP !== otp) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Invalid or expired OTP",
    );
  }
  const result: any = await userService.verifyOtpDB(email)


  await emitNotification({
    userId: result._id as string,
    userMsg: 'Your account has been successfully created.',
    adminMsg: 'A new user has registered.',
  });

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "Registration successful.",
    data: result,
  });
});

const loginUser = catchAsync(async (req, res) => {
  const { email, password } = req.body;
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
  await userService.forgotPasswordDB(email)
  const token = jwt.sign({ email, forgot: 'forgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "OTP sent to your email. Please check!",
    data: {
      token: token,
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
  if (forgot !== "forgot") {
    throw new AppError(httpStatus.BAD_REQUEST,
      "invalid token",
    );
  }
  const token = jwt.sign({ email, verifyForgot: 'verifyForgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
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
  const token = jwt.sign({ email, forgot: 'forgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
  if (!email) {
    throw new AppError(httpStatus.BAD_REQUEST,
      "Please provide a valid email address.",
    );
  }
  await userService.resendOtpDB(email)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "A new OTP has been sent to your email.",
    data: { token },
  });
});

const resetPassword = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const verifyForgot = decoded.verifyForgot
  if (verifyForgot !== "verifyForgot") {
    throw new AppError(httpStatus.BAD_REQUEST,
      "invalid token",
    );
  }
  const email = decoded.email;
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
  const result = await userService.updateUserDB(req.body, req.file, userId)

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
    data: result,
  });
});

const getAllUsers = catchAsync(async (req, res) => {
  const result = await userService.allUserDB(req.query,)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "User list retrieved successfully",
    data: result
  });
});
const IdentityVerification = catchAsync(async (req, res) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  const { step } = req.query;
  if (!step) {
    throw new AppError(httpStatus.BAD_REQUEST, "Please provide the 'step' query parameter for identity verification.");
  }
  if (step === '4') {
    req.body.isCompleted = true
  }
  const result = await userService.IdentityVerificationDB(userId, req.body, step as string)
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: `${step} Verified`,
    data: result
  });

}
)

const userActive = catchAsync(async (req, res) => {
  const { userId } = req.params
  console.log(userId);

  const isUserExist: IUser | null = await UserModel.findById(userId)

  console.log(isUserExist);

  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found ')
  }
  if (isUserExist.isVerify) {
    throw new AppError(httpStatus.BAD_REQUEST, "Alredy verify")
  }
  await UserModel.findByIdAndUpdate(
    userId, { isActive: true, isVerify: true }, { new: true }
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "The user is activated.",
    data: ""
  });
});
const userDeactive = catchAsync(async (req, res) => {
  const { userId } = req.params
  const isUserExist: IUser | null = await UserModel.findById(userId)
  if (!isUserExist) {
    throw new AppError(httpStatus.NOT_FOUND, 'user not found ')
  }
  if (!isUserExist.isActive) {
    throw new AppError(httpStatus.BAD_REQUEST, "Alredy deactive")
  }

  await UserModel.findByIdAndUpdate(
    userId, { isActive: false, isVerify: false }, { new: true }
  )
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: "The user is deactivated.",
    data: ""
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
  userActive,
  userDeactive
}







// /* eslint-disable @typescript-eslint/no-explicit-any */
// import httpStatus from "http-status";
// import jwt from "jsonwebtoken";
// import { JWT_SECRET_KEY, } from "../../../config";
// import AppError from "../../../errors/AppError";
// import { tokenDecoded } from "../../../middlewares/decoded";
// import catchAsync from "../../../utils/catchAsync";
// import sendResponse from "../../../utils/sendResponse";
// import { emitNotification } from "../../../utils/socket";

// import { sendRegistationOtpEmail } from "./sendEmail";
// import { IUser } from "./user.interface";
// import { UserModel } from "./user.model";
// import {
//   generateOTP,
//   getStoredOTP,
//   saveOTP,
//   userService,
// } from "./user.service";
// const registerUser = catchAsync(async (req, res) => {
//   const { email } = req.body;
//   const isUserRegistered: IUser | null = await UserModel.findOne({ email: email, isVerify: false });
//   if (isUserRegistered) {
//     await UserModel.findOneAndUpdate(
//       { email: email },
//       req.body,
//       { new: true, upsert: true }
//     );
//     const otp = generateOTP();
//     await saveOTP(email, otp);
//     await sendRegistationOtpEmail(otp, email);
//     const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Verify your account using the OTP sent to your email.",
//       data: {
//         token: token
//       }
//     });
//     return
//   }
//   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//   if (!emailRegex.test(email)) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Please provide a valid email address.",
//     );
//   }
//   const result = await userService.createUserDB(req.body)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Verify OTP to register.",
//     data: result
//   });
// });
// const verifyOTP = catchAsync(async (req, res) => {
//   const { otp } = req.body;
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const email = decoded.email;

//   const tokenOtp = decoded.otp
//   const storedOTP = await getStoredOTP(email);
//   if (tokenOtp !== storedOTP) {
//     throw new AppError(httpStatus.FORBIDDEN, "Invalid token ")
//   }
//   if (!storedOTP || storedOTP !== otp) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Invalid or expired OTP",
//     );
//   }
//   const result = await userService.verifyOtpDB(email)

//   await emitNotification({
//     userId: result._id as string,
//     userMsg: 'Your account has been successfully created.',
//     adminMsg: 'A new user has registered.',
//   });

//   sendResponse(res, {
//     statusCode: httpStatus.CREATED,
//     success: true,
//     message: "Registration successful.",
//     data: result,
//   });
// });

// const loginUser = catchAsync(async (req, res) => {
//   const { email, password } = req.body;
//   const isUserRegistered: IUser | null = await UserModel.findOne({ email: email, isVerify: false });
//   if (isUserRegistered) {
//     const otp = generateOTP();
//     await saveOTP(email, otp);
//     await sendRegistationOtpEmail(otp, email);
//     const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "Verify your account using the OTP sent to your email.",
//       data: {
//         isVerify: false,
//         token: token
//       }
//     });
//     return
//   }
//   const user = await userService.loginDB(email, password)

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Login complete!",
//     data: user
//   });
// });

// const forgotPassword = catchAsync(async (req, res) => {
//   const { email } = req.body;
//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Please provide an email.",
//     );
//   }
//   await userService.forgotPasswordDB(email)
//   const token = jwt.sign({ email, forgot: 'forgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "OTP sent to your email. Please check!",
//     data: {
//       token: token,
//     },
//   });
// },
// );

// const verifyForgotPasswordOTP = catchAsync(async (req, res) => {
//   const { otp } = req.body;
//   if (!otp) {
//     throw new AppError(httpStatus.BAD_REQUEST, 'otp is required')
//   }
//   const { decoded }: any = await tokenDecoded(req, res)
//   const email = decoded.email;
//   const forgot = decoded.forgot
//   if (forgot !== "forgot") {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "invalid token",
//     );
//   }
//   const token = jwt.sign({ email, verifyForgot: 'verifyForgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Please provide a valid email address.",
//     );
//   }
//   await userService.verifyForgotPasswordOtpDB(otp, email)
//   return sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "OTP verified successfully.",
//     data: {
//       token: token
//     },
//   });
// },
// );
// const resendOTP = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const email = decoded.email;
//   const user: IUser | null = await UserModel.findOne({ email: email })
//   if (!user) {
//     throw new AppError(httpStatus.NOT_FOUND, "User not found")
//   }
//   const token = jwt.sign({ email, forgot: 'forgot' }, JWT_SECRET_KEY as string, { expiresIn: "7d", });
//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Please provide a valid email address.",
//     );
//   }
//   if (!user?.isVerify) {
//     const otp = generateOTP();
//     await saveOTP(email, otp);
//     await sendRegistationOtpEmail(otp, email);
//     const token = jwt.sign({ email, otp: otp }, JWT_SECRET_KEY as string, { expiresIn: "7d" });
//     sendResponse(res, {
//       statusCode: httpStatus.OK,
//       success: true,
//       message: "A new OTP has been sent to your email.",
//       data: token
//     });
//     return
//   } else {

//     await userService.resendOtpDB(email)
//   }

//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "A new OTP has been sent to your email.",
//     data: token
//   });
// });

// const resetPassword = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const verifyForgot = decoded.verifyForgot
//   if (verifyForgot !== "verifyForgot") {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "invalid token",
//     );
//   }
//   const email = decoded.email;
//   if (!email) {
//     throw new AppError(httpStatus.BAD_REQUEST,
//       "Please provide a valid email address.",
//     );
//   }
//   await userService.resetPasswordDB(req.body, email)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Password reset successfully.",
//     data: null,
//   });


// });

// const changePassword = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const email = decoded.user.email;

//   await userService.changePasswordDB(req.body, email)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "You have successfully changed the password.",
//     data: null,
//   });
// },
// );

// const updateUser = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const userId = decoded.user._id;
//   const result = await userService.updateUserDB(req.body, req.file, userId)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "Profile updated.",
//     data: result,
//   });
// });

// const myProfile = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const userId = decoded.user._id;
//   const result = await userService.myProfileDB(userId)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "profile information retrieved successfully",
//     data: result,
//   });
// });

// const getAllUsers = catchAsync(async (req, res) => {
//   const result = await userService.allUserDB(req.query,)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "User list retrieved successfully",
//     data: result
//   });
// });
// const IdentityVerification = catchAsync(async (req, res) => {
//   const { decoded, }: any = await tokenDecoded(req, res)
//   const userId = decoded.user._id;
//   const { step } = req.query;
//   if (!step) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Please provide the 'step' query parameter for identity verification.");
//   }
//   if (step === '4') {
//     req.body.isCompleted = true
//   }
//   const result = await userService.IdentityVerificationDB(userId, req.body, step as string)
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: `${step} Verified`,
//     data: result
//   });

// }
// )

// const userActive = catchAsync(async (req, res) => {
//   const { userId } = req.params
//   const isUserExist: IUser | null = await UserModel.findById(userId)
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'user not found ')
//   }
//   if (isUserExist.isApprove) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Alredy approve")
//   }
//   await UserModel.findByIdAndUpdate(
//     userId, { isActive: true, isApprove: true }, { new: true }
//   )
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "The user is activated.",
//     data: ""
//   });
// });
// const userDeactive = catchAsync(async (req, res) => {
//   const { userId } = req.params
//   const isUserExist: IUser | null = await UserModel.findById(userId)
//   if (!isUserExist) {
//     throw new AppError(httpStatus.NOT_FOUND, 'user not found ')
//   }
//   if (!isUserExist.isActive) {
//     throw new AppError(httpStatus.BAD_REQUEST, "Alredy deactive")
//   }

//   await UserModel.findByIdAndUpdate(
//     userId, { isActive: false, isApprove: false }, { new: true }
//   )
//   sendResponse(res, {
//     statusCode: httpStatus.OK,
//     success: true,
//     message: "The user is deactivated.",
//     data: ""
//   });
// });

// export const userController = {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   verifyForgotPasswordOTP,
//   resendOTP,
//   resetPassword,
//   changePassword,
//   updateUser,
//   myProfile,
//   getAllUsers,
//   verifyOTP,
//   IdentityVerification,
//   userActive,
//   userDeactive
// }






