
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../../basic_modules/user/user.interface";
import { UserModel } from "../../basic_modules/user/user.model";
import { categoryModel } from "../category/category.model";
import { subscriptionHandle } from "./jobPost-constant";
import { TJobPost } from "./jobPost.interface";
import { JobPostModel } from "./jobPost.model";
import { jobService } from "./jobPost.service";

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
        throw new AppError(httpStatus.FORBIDDEN, "Your account is not approved by admin.");
    }
    if (!user.isActive) {
        throw new AppError(httpStatus.UNAUTHORIZED, "The admin has blocked you.")
    }
    if (!user.purchasePlan) {
        throw new AppError(httpStatus.FORBIDDEN, "Please purchase subscription plan  ")
    }
    if (!user.isVerify) {
        throw new AppError(httpStatus.UNAUTHORIZED, "This Account is not verify")
    }
    if (req.body.tags && req.body.tags.length > 0) {
        for (const tag of req.body.tags) {
            const foundTag = await categoryModel.findOne({ catagoryType: tag });
            if (!foundTag) {
                throw new AppError(httpStatus.NOT_FOUND, `Category not found for tag: ${tag}`);
            }
        }
    } else {
        throw new AppError(httpStatus.NOT_FOUND, "No tags provided or tags are empty");
    }
    await subscriptionHandle(user, req.body)
    const result: TJobPost = await jobService.crateJobDB(userId, user.purchasePlan.subscriptionId, user.purchasePlan._id, req.body)
    for (const tag of result.tags) {
        await categoryModel.findOneAndUpdate(
            { catagoryType: tag },
            { $inc: { jobPostCount: 1 } },
            { new: true }
        );

    }

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Job post  created successfully',
        data: result
    });
})


const getAllJobs = catchAsync(async (req, res) => {
    const jobs = await jobService.candidateAllJobsDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All jobs fetched successfully",
        data: jobs
    });
});
const singleJobs = catchAsync(async (req, res) => {
    const { jobId } = req.params
    const job = await JobPostModel.findById(jobId)
    if (!job) {
        throw new AppError(httpStatus.NOT_FOUND, "Job not found");
    }
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Job fetched successfully",
        data: job
    });
});
export const jobController = {
    createJob,
    getAllJobs,
    singleJobs,

}