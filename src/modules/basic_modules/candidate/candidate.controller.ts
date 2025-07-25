/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../user/user.interface";
import { UserModel } from "../user/user.model";
import { candidateModel } from "./candidate.model";
import { camdidateIIdentityVerificationService } from "./candidate.service";

const candidateIdentityVerification = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const email = decoded?.user?.email;
    const user: IUser | null = await UserModel.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, " user not found ")
    }
    const { step } = req.query;
    if (!step) {
        throw new AppError(httpStatus.BAD_REQUEST, "Please provide the 'step' query parameter for identity verification.");
    }
    const result: any = await camdidateIIdentityVerificationService.candidateIdentityVerificationDB(email, req.body, step as string)
    console.log(result);

    if (!user.isCompleted) {
        await UserModel.findByIdAndUpdate(userId, { step: step }, { new: true })
    }
    let message
    if (user.isCompleted) {
        message = "Profile updated successfully";
    } else if (step === "4") {
        message = "Profile completed successfully ! ";
        await UserModel.findByIdAndUpdate(userId, { isCompleted: true, candidateInfo: result._id, step: step }).populate('candidateInfo')
        const updateCandidate = await UserModel.findById(userId).populate({
            path: "candidateInfo",
            select: "title parsonalWebsite image experience cv educations  maritalStatus gender dateOfBrith biography  nationality  address facebook twitter instagram youtube linkedin  phone jobLevel jobType contactEmail  "
        })
        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: message,
            data: updateCandidate
        });
        return
    } else {
        message = `Step ${step} Verified`;
    }
    const updateCandidate = await UserModel.findById(userId).populate({
        path: "candidateInfo",
        select: "title parsonalWebsite image experience cv educations  maritalStatus gender dateOfBrith biography  nationality  address facebook twitter instagram youtube linkedin  phone jobLevel jobType contactEmail  "
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: message,
        data: updateCandidate
    });
}
)

const candidateJobAlert = catchAsync(async (req, res) => {
    const { decoded }: any = await tokenDecoded(req, res);
    const userId = decoded.user._id;
    const email = decoded.user.email;
    const user: IUser | null = await UserModel.findById(userId)
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "User not found");
    }
    const { jobType, jobLevel } = req.body;
    if (!jobType || !jobLevel) {
        throw new AppError(httpStatus.BAD_REQUEST, "Job Type and Job Level are required");
    }
    if (!Array.isArray(jobType) || !Array.isArray(jobLevel)) {
        throw new AppError(httpStatus.BAD_REQUEST, "Job Type and Job Level must be arrays");
    }
    await candidateModel.findOneAndUpdate(
        { email },
        { jobType, jobLevel },
        { new: true }
    )
    const updateUser: IUser | null = await UserModel.findById(userId).populate({
        path: "candidateInfo",
        select: "title parsonalWebsite image experience cv educations  maritalStatus gender dateOfBrith biography  nationality  address facebook twitter instagram youtube linkedin  phone jobLevel jobType contactEmail  "
    });
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job alert preferences updated successfully",
        data: updateUser
    });
})


export const candidateIdentityVerificationController = {
    candidateIdentityVerification
    , candidateJobAlert
}