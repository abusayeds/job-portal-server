/* eslint-disable @typescript-eslint/no-explicit-any */

import { Request, Response } from "express";
import httpStatus from "http-status";
import { STRIPE_WEBHOOK_SECRET } from "../../../config";
import { admin } from "../../../DB";
import AppError from "../../../errors/AppError";
import { UserModel } from "../../basic_modules/user/user.model";
import { cleanSubscriptionData } from "../purchasePlan/purchase.constant";
import { stripe } from "../purchasePlan/purchasePlan.controller";
import { purchasePlanModel } from '../purchasePlan/purchasePlan.model';
import { subscriptionModel } from "../subscription/subscription.model";

const webhook = async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"];
    let event;
    try {
        const webhookSecret = STRIPE_WEBHOOK_SECRET;
        if (!webhookSecret) {
            throw new AppError(httpStatus.BAD_REQUEST, " Webhook Secret Key Missing!");
        }
        event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
        if (event.type === 'invoice.payment_succeeded') {
            const invoice = event.data.object;
            const subscriptionId = invoice.subscription;
            if (subscriptionId) {
                await stripe.subscriptions.update(subscriptionId, { cancel_at_period_end: true });
                const metadata = invoice.subscription_details.metadata;
                const subs_info = await subscriptionModel.findById(metadata.subscriptionId);
                if (!subs_info) {
                    throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
                }
                const payload = await cleanSubscriptionData(subs_info, metadata.numberOfEmployees);

                const expiryDateTimestamp = Date.now() + (payload.expiryDate * 24 * 60 * 60 * 1000) || null;
                const purchasePlanData = { userId: metadata.userId, expiryDateTimestamp, subscriptionId, ...payload }
                const isExixtPlan = await purchasePlanModel.findOne({ userId: metadata.userId, subscriptionId, })
                let purchasePlan;
                if (isExixtPlan) {
                    purchasePlan = await purchasePlanModel.findByIdAndUpdate(isExixtPlan._id, {
                        ...payload,
                        expiryDateTimestamp
                    }, { new: true });
                } else {
                    purchasePlan = await purchasePlanModel.create(purchasePlanData);
                }
                if (!purchasePlan) {
                    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create or update purchase plan');
                }
                const adminAccount = await UserModel.findOne({ email: admin.email });
                await UserModel.findByIdAndUpdate(metadata.userId, { purchasePlan: purchasePlan._id }, { new: true })
                if (!adminAccount) {
                    throw new Error("admin  not found.");
                }
                adminAccount.adminErnings += purchasePlan.planPrice;
                await adminAccount.save();

            } else {
                console.log(" Subscription ID not found in invoice.");
                throw new AppError(httpStatus.NOT_FOUND, "Subscription ID not found in invoice.")
            }
        }
    } catch (err: any) {
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }
    res.json({ received: true });
}

export const webhookController = {
    webhook
}

