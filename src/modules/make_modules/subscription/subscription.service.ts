import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { basicPlan, standardPlan, unlimitedPlan } from "./subscription.constant";
import { TSubscription } from "./subscription.iterface";
import { subscriptionModel } from "./subscription.model";

const createSubscriptionDB = async (payload: TSubscription) => {
    if (!payload.planName) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan name is required ")
    }
    if (payload.planName === "unlimited plan") {
        await unlimitedPlan(payload);
    } else if (payload.planName === "standard plan") {
        await standardPlan(payload);
    } else if (payload.planName === "basic plan") {
        await basicPlan(payload);
    }
    const result = await subscriptionModel.create(payload);
    return result
}
const updateSubscriptionDB = async (payload: TSubscription, subs_id: string) => {
    if (!payload.planName) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan name is required ");
    }
    if (payload.planName === "unlimited plan") {
        await unlimitedPlan(payload);
    } else if (payload.planName === "standard plan") {
        await standardPlan(payload);
    } else if (payload.planName === "basic plan") {
        await basicPlan(payload);
    }
    const result = await subscriptionModel.findByIdAndUpdate(subs_id, payload, { new: true });
    return result;
}

export const sebscriptionService = {
    createSubscriptionDB, updateSubscriptionDB
}

