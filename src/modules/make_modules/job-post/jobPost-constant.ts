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
    if (payload.tags.length > 1 && !subscription.tegs) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot give more than one tag with the ${subscription?.planName} subscription.`)
    }
    if (!subscription.schedule_dates && payload.scheduleDate) {
        throw new AppError(httpStatus.BAD_REQUEST, `schedule Date not allow for ${subscription?.planName} subscription`)
    }
    if (subscription.schedule_dates) {
        throw new AppError(httpStatus.BAD_REQUEST, `Schedule dates is required for ${subscription?.planName} subscription.`)
    }
    // if (subscription.planName === "basic plan") {
    //     console.log("basic plan subscription = >>>> ", user);
    // } else if (subscription.planName === "standard plan") {
    //     console.log("standard plan subscription = >>>> ", user);
    // } else if (subscription.planName === "unlimited plan") {
    //     console.log("unlimited plan subscription = >>>> ", user);
    // }
}

