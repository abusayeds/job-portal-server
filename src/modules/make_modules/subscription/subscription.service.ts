import { basicPlan, standardPlan, unlimitedPlan } from "./subscription.constant";
import { TSubscription } from "./subscription.iterface";
import { subscriptionModel } from "./subscription.model";

const createSubscriptionDB = async (payload: TSubscription) => {
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

export const sebscriptionService = {
    createSubscriptionDB
}

