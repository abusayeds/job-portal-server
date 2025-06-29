import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TPurchasePlan } from "../purchasePlan/purchasePlan.interface";
import { purchasePlanModel } from "../purchasePlan/purchasePlan.model";
import { TJobPost } from "./jobPost.interface";
import { JobPostModel } from "./jobPost.model";

const crateJobDB = async (userId: string, subscriptionId: string, palan: string, payload: TJobPost) => {
    const subs_palan: TPurchasePlan | null = await purchasePlanModel.findOne({ _id: palan, subscriptionId: subscriptionId });
    const jobs = await JobPostModel.find({ subscriptionId: subscriptionId })


    if (subs_palan && jobs.length > 0 && subs_palan.planName !== "unlimited plan") {
        const jobpostCount = Number(subs_palan.jobpost);
        if (jobpostCount <= jobs.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "This subscription limit has ended.");
        }
    }
    if (!subs_palan) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found ! ")
    }
    if (payload.logo && !payload.logo.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
    }
    if (payload.banner && !payload.banner.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid banner path");
    }
    const jobData = {
        ...payload,
        userId,
        subscriptionId,
        palan
    }

    const result = await JobPostModel.create(jobData)
    return result

}

export const jobService = {
    crateJobDB
}