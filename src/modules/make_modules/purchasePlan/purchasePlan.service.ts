/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { stripe } from "./purchasePlan.controller";
import { purchasePlanModel } from "./purchasePlan.model";

const makeAutoRenewalDB = async (userId: string, subscriptionId: string, payload: any) => {
    const { autoRenewal } = payload;

    if (autoRenewal === undefined) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid input: 'autoRenewal' is required.");
    }
    if (typeof autoRenewal !== 'boolean') {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid input: 'autoRenewal' must be a boolean.");
    }

    const existingSubscription = await purchasePlanModel.findOne({ userId, subscriptionId });
    if (!existingSubscription) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found.");
    }
    const subscription = await stripe.subscriptions.retrieve(subscriptionId);
    if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, "Stripe subscription not found.");
    }

    const updatedSubscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: !autoRenewal,
    });


    const updatedSubscriptionDB = await purchasePlanModel.findOneAndUpdate(
        { userId, subscriptionId },
        { autoRenewal },
        { new: true }
    );

    if (!updatedSubscription) {
        throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "Failed to update subscription.");
    }


    console.log('Subscription details:', updatedSubscription.cancel_at_period_end);
    return updatedSubscriptionDB;
}


export const autoRenewalService = {
    makeAutoRenewalDB
};