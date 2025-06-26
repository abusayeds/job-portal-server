import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
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
export const subscriptionController = {
    createSubscription,
}