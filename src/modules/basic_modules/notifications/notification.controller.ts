/* eslint-disable @typescript-eslint/no-explicit-any */


import { Request, Response } from "express";


import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserModel } from "../user/user.model";
import { NotificationModel } from "./notification.model";



export const getMyNotification = catchAsync(async (req: Request, res: Response) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  console.log(userId)
  const user = await UserModel.findById(userId)
  if (!user) throw new AppError(404, "User not found");
  
  const notifications = await NotificationModel.find({ userId: userId });
  sendResponse(res, { statusCode: 200, success: true, message: "Notifications retrieved successfully", data: notifications });
}
);
