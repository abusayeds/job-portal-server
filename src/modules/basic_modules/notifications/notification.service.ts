import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { NotificationModel } from "./notification.model";
import { INotification } from "./notification.interface";

export const createNotification = async (payload: INotification) => {
    const newNotification = await NotificationModel.create(payload);
    if (!newNotification) {
        throw new AppError(httpStatus.BAD_REQUEST, "Failed to create notification");
    }
    return newNotification;
}