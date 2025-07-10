
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { basicPlan, standardPlan, unlimitedPlan } from "./subscription.constant";
import { TSubscription } from "./subscription.iterface";
import { subscriptionModel } from "./subscription.model";
import { updateBasicPlan, updateStandardPlan, updateUnlimitedPlan } from "./subscription.validation";

const createSubscriptionDB = async (payload: TSubscription) => {
    const all_subs = await subscriptionModel.find({ isVisible: true })
    if (all_subs.length >= 3) {
        throw new AppError(httpStatus.BAD_REQUEST, "Already three subscriptions added");
    }
    if (!payload.planName) {
        throw new AppError(httpStatus.BAD_REQUEST, "Plan name is required ")
    }
    if (payload.planName === "unlimited_plan") {
        await unlimitedPlan(payload);
    } else if (payload.planName === "standard_plan") {
        await standardPlan(payload);
    } else if (payload.planName === "basic_plan") {
        await basicPlan(payload);
    }
    const result = await subscriptionModel.create(payload);
    return result
}
const updateSubscriptionDB = async (payload: TSubscription, subs_id: string) => {
    const subs: TSubscription | null = await subscriptionModel.findById(subs_id)
    if (!subs) {
        throw new AppError(httpStatus.BAD_REQUEST, "Subscription not found ? ");
    }
    if (subs.planName === "unlimited_plan") {
        await updateUnlimitedPlan(payload);
    } else if (payload.planName === "standard_plan") {
        await updateStandardPlan(payload);
    } else if (payload.planName === "basic_plan") {
        await updateBasicPlan(payload);
    }
    const result = await subscriptionModel.findByIdAndUpdate(subs_id, payload, { new: true });
    return result;
}



export const sebscriptionService = {
    createSubscriptionDB, updateSubscriptionDB,
}

