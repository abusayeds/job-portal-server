import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { subscriptionModel } from "./subscription.model";
import { sebscriptionService } from "./subscription.service";

const createSubscription = catchAsync(async (req, res) => {
    const subscription = await sebscriptionService.createSubscriptionDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Subscription created.",
        data: subscription
    });
});
const updateSubscription = catchAsync(async (req, res) => {
    const { subs_id } = req.params
    const subscription = await sebscriptionService.updateSubscriptionDB(req.body, subs_id);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Subscription updated successfully",
        data: subscription
    });
});
const allSubscription = catchAsync(async (req, res) => {
    const subscription = await subscriptionModel.aggregate([
        {
            $addFields: {
                sortOrder: {
                    $switch: {
                        branches: [
                            { case: { $eq: ["$planName", "basic_plan"] }, then: 1 },
                            { case: { $eq: ["$planName", "standard_plan"] }, then: 2 },
                            { case: { $eq: ["$planName", "unlimited_plan"] }, then: 3 }
                        ],
                        default: 99
                    }
                }
            }
        },
        {
            $project: {
                _id: 1,
                planName: 1,
                planPrice: 1,
                expiryDate: 1,
                jobpost: 1,
                discount: 1,
                unlimited_text: 1,
                add_logo_images: 1,
                avg_viewed_1000: 1,
                multi_categories: 1,
                isVisible: 1,
                numberOfEmployees: {
                    $cond: {
                        if: { $or: [{ $eq: ["$planName", "basic_plan"] }, { $eq: ["$planName", "standard_plan"] }] },
                        then: "$$REMOVE",
                        else: "$numberOfEmployees"
                    }
                },
                schedule_dates: 1,
                unlimited_postings: 1,
                fill_multiple_positions: 1,
                continuous_posting: 1,
                multi_user_access: 1,
                popular_choice: 1,
                cost_effective: 1,
                no_time_limit: 1,
                updatedAt: 1,
                sortOrder: 1
            }
        },
        { $sort: { sortOrder: 1 } }
    ]);


    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Subscription fetched successfully.",
        data: subscription
    });
});


export const subscriptionController = {
    createSubscription,
    allSubscription,
    updateSubscription
}