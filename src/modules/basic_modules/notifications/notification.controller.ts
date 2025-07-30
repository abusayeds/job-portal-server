/* eslint-disable @typescript-eslint/no-explicit-any */


import { Request, Response } from "express";


import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserModel } from "../user/user.model";
import { NotificationModel } from "./notification.model";
import queryBuilder from "../../../builder/queryBuilder";



export const getMyNotification = catchAsync(async (req: Request, res: Response) => {
  const { decoded, }: any = await tokenDecoded(req, res)
  const userId = decoded.user._id;
  const user = await UserModel.findById(userId)
  if (!user) throw new AppError(404, "User not found");
  
  // const notifications = await NotificationModel.find({ userId: userId });

  let myQuery: any; 
  let totalData: number;
  const query = req.query;
  
  myQuery = new queryBuilder(
    NotificationModel.find({  userId: userId }),
    query
  )
    .filter()
    .sort();
  const paginationResult = await myQuery.paginate(
    NotificationModel.find({  userId: userId })
  );
  totalData = paginationResult.totalData;

  const notifications = await myQuery.modelQuery.exec();

  await Promise.all(
    notifications.map((notification: any) => {
      if (!notification.isRead) {
        notification.isRead = true;
        return notification.save();
      }
      return Promise.resolve();
    })
);

  const currentPage = Number(query?.page) || 1;
  const limit = Number(query.limit) || 10;
  const pagination = myQuery.calculatePagination({
    totalData,
    currentPage,
    limit,
  });
  sendResponse(res, { statusCode: 200, success: true, message: "Notifications retrieved successfully", data: {pagination, notifications} });
});

export const getUnreadNotificationCount = catchAsync(async (req: Request, res: Response) => {
  const { decoded }: any = await tokenDecoded(req, res);
  const userId = decoded.user._id;

  const user = await UserModel.findById(userId);
  if (!user) throw new AppError(404, "User not found");

  const unreadCount = await NotificationModel.countDocuments({
    userId,
    isRead: false,
  });

  sendResponse(res, { statusCode: 200, success: true, message: "Unread notification count retrieved successfully", data: unreadCount });
});
