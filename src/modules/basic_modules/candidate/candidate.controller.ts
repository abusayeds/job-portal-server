/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { camdidateIIdentityVerificationService } from "./candidate.service";

const candidateIdentityVerification = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const user: IUser | null = await UserModel.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, " user not found ")
    }
    const { step } = req.query;
    if (!step) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please provide the 'step' query parameter for identity verification.");
    }
    const result = await camdidateIIdentityVerificationService.candidateIdentityVerificationDB(userId, req.body, step as string)

    if (!user.isCompleted) {
        await UserModel.findByIdAndUpdate(userId, { step: step }, { new: true })
    }
    let message
    if (user.isCompleted) {
        message = "Profile updated successfully";
    } else if (step === "4") {
        message = "Profile completed, please wait for admin approval";
        const result = await UserModel.findByIdAndUpdate(userId, { isCompleted: true, step: step }).populate('candidateInfo')
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: message,
            data: result
        });
        return
    } else {
        message = `Step ${step} Verified`;
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: message,
        data: ' '
    });
}
)

export const candidateIdentityVerificationController = {
    candidateIdentityVerification
}