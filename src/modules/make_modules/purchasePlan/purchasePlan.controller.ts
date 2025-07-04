/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */


import httpStatus from "http-status";
import { STRIPE_SECRET_KEY } from "../../../config";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../../basic_modules/user/user.interface";
import { UserModel } from "../../basic_modules/user/user.model";
import { TSubscription } from "../subscription/subscription.iterface";
import { subscriptionModel } from "../subscription/subscription.model";
import { autoRenewalService } from "./purchasePlan.service";

export const stripe = require("stripe")(STRIPE_SECRET_KEY);

const purchasePlan = catchAsync(async (req, res) => {
    const { productId } = req.params;
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const userEmail = decoded.user.email;
    if (decoded.user.isVerify === false) {
        throw new AppError(httpStatus.UNAUTHORIZED, "You are not verified.")
    }
    if (decoded.user.isApprove === false) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please wait for admin approval")
    }
    const user: IUser | any = await UserModel.findById(userId)
    if (user.isCompleted === false) {
        throw new AppError(httpStatus.NOT_FOUND,
            "Please complete your acccout",
        );
    }
    const { numberOfEmployees }: any = req.query;
    const product: TSubscription | null = await subscriptionModel.findById(productId);
    if (product?.planName === "unlimited plan") {
        if (numberOfEmployees === undefined || !numberOfEmployees) {
            throw new AppError(httpStatus.BAD_REQUEST, 'numberOfEmployees is required for unlimited plan');
        }
        if (parseInt(numberOfEmployees) < 0 || parseInt(numberOfEmployees) > 2) {
            throw new AppError(httpStatus.BAD_REQUEST, 'numberOfEmployees must be between 0 and 2');
        }
    }
    if (!product) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
    }

    try {
        let finalPrice = product.planPrice * 100;
        if (product?.planName === "unlimited plan") {
            const index = parseInt(numberOfEmployees);
            finalPrice = product.numberOfEmployees[index].price * 100;
        } else if (product.planName === "standard plan") {
            if (product.discount) {
                finalPrice = (Number(product.planPrice) - Number(product.discount)) * 100;
            } else {
                finalPrice = product.planPrice * 100;
            }
        } else {
            finalPrice = product.planPrice * 100;
        }
        let interval = 'month';
        let intervalCount = 1;
        if (product.expiryDate === 30) {
            interval = 'month';
            intervalCount = 1;
        } else if (product.expiryDate === 60) {
            interval = 'month';
            intervalCount = 2;
        } else if (product.expiryDate === 365) {
            interval = 'year';
            intervalCount = 1;
        } else if (product.expiryDate === 730) {
            interval = 'year';
            intervalCount = 2;
        }


        const price = await stripe.prices.create({
            unit_amount: finalPrice,
            currency: 'usd',
            recurring: { interval, interval_count: intervalCount },
            product_data: {
                name: `Plan for ${product.planName}`,
            },
        });
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                },
            ],
            customer_email: userEmail,
            mode: 'subscription',
            success_url: `https://maggy-client-sayed-server.sarv.live/paymentSuccess`,
            cancel_url: `https://maggy-client-sayed-server.sarv.live/payment-cancel`,
            subscription_data: {
                metadata: {
                    subscriptionId: productId,
                    userId: userId,
                    numberOfEmployees: numberOfEmployees
                }
            }
        });
        if (!session || !session.url) {
            throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to create checkout session');
        }
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Checkout session created successfully',
            data: { url: session.url, sessionId: session.id },
        });
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Error creating checkout session');
    }
});
const autoRenewal = catchAsync(async (req, res) => {
    const { subscriptionId } = req.params;
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const result = await autoRenewalService.makeAutoRenewalDB(userId, subscriptionId, req.body);
    try {
        if (result && result.autoRenewal === true) {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'Auto-renewal enabled successfully',
                data: result,
            });
        } else {
            sendResponse(res, {
                statusCode: httpStatus.OK,
                success: true,
                message: 'Auto-renewal disabled successfully',
                data: result,
            });
        }
    } catch (error) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Error enabling auto-renewal');
    }
})
export const purchasePlanController = {
    purchasePlan,
    autoRenewal,
};


// const stripe = require('stripe')('your_stripe_secret_key'); // স্ট্রাইপ সিক্রেট কী

// app.post('/create-checkout-session', async (req, res) => {
//   const { planId, userId, productId } = req.body;

//   try {
//     // MongoDB থেকে প্রোডাক্ট তথ্য বের করুন
//     const product = await Product.findById(productId);
//     if (!product) {
//       return res.status(404).send('Product not found');
//     }

//     const finalPrice = product.finalPrice * 100; // স্ট্রাইপে সেন্টে দরকার, তাই ১০০ গুণ

//     // স্ট্রাইপ Checkout সেশন তৈরি করুন
//     const session = await stripe.checkout.sessions.create({
//       payment_method_types: ['card'],
//       line_items: [
//         {
//           price_data: {
//             currency: 'usd',
//             product_data: {
//               name: product.name,
//             },
//             unit_amount: finalPrice, // MongoDB থেকে আসা চূড়ান্ত দাম
//           },
//           quantity: 1,
//         },
//       ],
//       mode: 'subscription',
//       success_url: `${process.env.FRONTEND_URL}/success?session_id={CHECKOUT_SESSION_ID}`, // পেমেন্ট সফল হলে
//       cancel_url: `${process.env.FRONTEND_URL}/cancel`, // পেমেন্ট বাতিল হলে
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('Error creating checkout session:', error);
//     res.status(500).send('Error creating checkout session');
//   }
// });
