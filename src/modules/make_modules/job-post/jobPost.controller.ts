
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../../basic_modules/user/user.interface";
import { UserModel } from "../../basic_modules/user/user.model";
import { subscriptionHandle } from "./jobPost-constant";

const createJob = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id
    const user: IUser | any = await UserModel.findById(userId)
        .select("+password -createdAt -updatedAt -__v -isDeleted")
        .populate({ path: "purchasePlan", select: "-createdAt -updatedAt -__v -isVisible" });
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not Found ")
    }
    if (!user.isApprove) {
        throw new AppError(httpStatus.UNAUTHORIZED, "Please wait for admin approval ")
    }
    if (!user.purchasePlan) {
        throw new AppError(httpStatus.FORBIDDEN, "Please purchase subscription plan  ")
    }
    if (!user.isVerify) {
        throw new AppError(httpStatus.UNAUTHORIZED, "This Account is not verify")
    }

    //** subscription logic validation hendle **//
    await subscriptionHandle(user, req.body)

    // const result = await jobService.crateJobDB(userId, req.body)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Job post  created successfully',
        data: ''
    });
})


export const jobController = {
    createJob
}