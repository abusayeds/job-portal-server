
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { UserModel } from '../../basic_modules/user/user.model';
import { JobPostModel } from '../job-post/jobPost.model';
import { TSubscription } from "../subscription/subscription.iterface";
import { subscriptionModel } from '../subscription/subscription.model';
import { stripe } from "./purchasePlan.controller";
import { TPurchasePlan } from './purchasePlan.interface';
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



    return updatedSubscriptionDB;
}


const latestInvoiceDB = async (userId: string, query: Record<string, unknown>,) => {
    const subs_query = new queryBuilder(purchasePlanModel.find({ userId: userId }).populate({path: 'userId', select: 'companyName address'}), query)
    subs_query.sort();

    const { totalData } = await subs_query.paginate(purchasePlanModel.find({ userId: userId }))
    const subs: any = await subs_query.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = subs_query.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    return {
        pagination, latest_invoice: subs
    }
}

const myPlanDB = async (userId: string) => {
    const user = await UserModel.findById(userId).populate("purchasePlan")

    const subs_palan: TPurchasePlan | null = await purchasePlanModel.findOne({ _id: user.purchasePlan._id, subscriptionId: user.purchasePlan.subscriptionId })

    if (!subs_palan) {
        throw new AppError(404, "Subscription plan not found ")
    }
    const jobs = (await JobPostModel.find({ subscriptionId: user.purchasePlan.subscriptionId }))

    const expiryDate = new Date(subs_palan.expiryDateTimestamp);


    const nextInvoiceDate = new Date(expiryDate);
    nextInvoiceDate.setDate(expiryDate.getDate() + 1);

    const nextInvoiceFormatted = nextInvoiceDate.toLocaleDateString('en-GB');

    const subscription: TSubscription | null = await subscriptionModel.findOne({ planName: subs_palan?.planName })
    if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, "subscription not found ")
    }
    // const remaining = Math.max(Number(subs_palan?.jobpost) - jobs.length) || "Unlimited"
    const remaining = `${subs_palan?.planName !== "unlimited_plan" ? Math.max(Number(subs_palan?.jobpost) - jobs.length) : "Unlimited"}`
    console.log(subs_palan?.planName);

    const myPlan: any = {
        myPlan: subs_palan,
        remaining,
        nextInvoice: {
            _id: subscription._id,
            planName: subscription?.planName,
            planPrice: subscription?.planPrice || subscription?.numberOfEmployees[subs_palan?.unlimitedPlanIndex].price,
            nextStartDate: nextInvoiceFormatted,
            autoRenewal: subs_palan.autoRenewal
        }
    }




    return myPlan
}

export const purchasePlanService = {
    makeAutoRenewalDB,
    latestInvoiceDB,
    myPlanDB
};