/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IUser } from "../../basic_modules/user/user.interface";
import { TPurchasePlan } from "../purchasePlan/purchasePlan.interface";
import { TJobPost } from "./jobPost.interface";

export const subscriptionHandle = async (user: IUser | any, payload: TJobPost) => {
    const subscription: TPurchasePlan = user?.purchasePlan
    if (payload.maxSalary < payload.minSalary) {
        throw new AppError(httpStatus.BAD_REQUEST, "Max salary cannot be less than min salary.");
    }
    if (payload.expirationDate) {
        const expiration = new Date(payload.expirationDate);
        if (isNaN(expiration.getTime())) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid expiration date format.");
        }
        if (expiration < new Date()) {
            throw new AppError(httpStatus.BAD_REQUEST, "Expiration date cannot be in the past.");
        }
    }


    if (payload.tags.length > 1 && !subscription.multi_categories) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot give more than one tag with the ${subscription?.planName} subscription.`)
    }
    if (!subscription.schedule_dates && payload.scheduleDate) {
        throw new AppError(httpStatus.BAD_REQUEST, `schedule Date not allow for ${subscription?.planName} subscription`)
    }
    if (payload.scheduleDate) {
        const scheduleDate = new Date(payload.scheduleDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set today's date to midnight to ignore the time part

        if (scheduleDate < today) {
            throw new AppError(httpStatus.BAD_REQUEST, "The schedule date cannot be in the past")
        } else {
            console.log(scheduleDate); // Valid schedule date
        }
    }


}

export const searchJobs: Array<keyof TJobPost> = ["jobTitle"]