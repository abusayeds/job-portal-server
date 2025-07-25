/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { IUser } from "../../basic_modules/user/user.interface";
import { UserModel } from "../../basic_modules/user/user.model";
import { jobService } from "../job-post/jobPost.service";
import { appliedJobsService } from "./applied.jobs.service";

const createAppliedJob = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const { jobId } = req.params
    const appliedJob = await appliedJobsService.createAppliedJobDB(req.body, userId, jobId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Applied Successfully",
        data: appliedJob
    })
})
const getMyAppliedJobs = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const user: IUser | null = await UserModel.findById(userId);
    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, "  User not found ")
    }
    if (!user.isActive) {
        throw new AppError(httpStatus.NOT_FOUND, "Your account is inactive.");
    }

    if (user.isDeleted) {
        throw new AppError(httpStatus.NOT_FOUND, "Your account has been deleted by admin ");
    }
    let jobs
    if (user.role === "employer" || user.role === "employe") {
        jobs = await jobService.employerAllPostedJobs(userId, req.query, user.role,)
    } else {
        jobs = await appliedJobsService.getMyAppliedJobsDB(userId, req.query)
    }
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "All jobs fetched successfully",
        data: jobs
    })
})
const overview = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const role = decoded.user.role;
    const appliedJob = await appliedJobsService.overviewDB(userId, role)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "overview fecth successfully",
        data: appliedJob
    })
})

export const appliedJobController = {
    createAppliedJob,
    getMyAppliedJobs,
    overview
}