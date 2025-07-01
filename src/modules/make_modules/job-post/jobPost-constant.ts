/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IUser } from "../../basic_modules/user/user.interface";
import { TJobPost } from "./jobPost.interface";

export const subscriptionHandle = async (user: IUser | any, payload: TJobPost) => {
    const subscription = user?.purchasePlan
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
    if (payload.tags.length > 1 && !subscription.tegs) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot give more than one tag with the ${subscription?.planName} subscription.`)
    }
    if (!subscription.schedule_dates && payload.scheduleDate) {
        throw new AppError(httpStatus.BAD_REQUEST, `schedule Date not allow for ${subscription?.planName} subscription`)
    }
    if (payload.scheduleDate) {
        const expiration = new Date(payload.scheduleDate);
        if (isNaN(expiration.getTime())) {
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid scheduledate format.");
        }
        if (expiration < new Date()) {
            throw new AppError(httpStatus.BAD_REQUEST, "schedule date cannot be in the past.");
        }
    }

    // if (subscription.planName === "basic plan") {
    //     console.log("basic plan subscription = >>>> ", user);
    // } else if (subscription.planName === "standard plan") {
    //     console.log("standard plan subscription = >>>> ", user);
    // } else if (subscription.planName === "unlimited plan") {
    //     console.log("unlimited plan subscription = >>>> ", user);
    // }
}

