import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TNotification } from "./notification.interface";
import { NotificationModel } from "./notification.model";


export const createNotification = async (payload: TNotification) => {
    const newNotification = await NotificationModel.create(payload);
    if (!newNotification) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create notification");
    }
    return newNotification;
}