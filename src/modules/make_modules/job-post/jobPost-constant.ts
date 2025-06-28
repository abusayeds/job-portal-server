/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { IUser } from "../../basic_modules/user/user.interface";
import { TJobPost } from "./jobPost.interface";

export const subscriptionHandle = async (user: IUser | any, payload: TJobPost) => {
    const subscription = user?.purchasePlan
    console.log(payload.tags.length);

    if (payload.tags.length > 1 && !subscription.tegs) {
        throw new AppError(httpStatus.BAD_REQUEST, `You cannot give more than one tag with the ${subscription?.planName} subscription.`)
    }
    // if (subscription.planName === "basic plan") {
    //     console.log("basic plan subscription = >>>> ", user);
    // } else if (subscription.planName === "standard plan") {
    //     console.log("standard plan subscription = >>>> ", user);
    // } else if (subscription.planName === "unlimited plan") {
    //     console.log("unlimited plan subscription = >>>> ", user);
    // }
}

