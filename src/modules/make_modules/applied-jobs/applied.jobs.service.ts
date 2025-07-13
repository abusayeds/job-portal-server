import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { JobPostModel } from "../job-post/jobPost.model";
import { TAppliedJob } from "./applied.jobs.interface";
import { AppliedJobModel } from "./applied.jobs.model";

const createAppliedJobDB = async (payload: TAppliedJob, userId: string, jobId: string) => {
    const jobs = await JobPostModel.findById(jobId);
    if (!jobs) {
        throw new AppError(httpStatus.NOT_FOUND, "Job not found");
    }
    const existingApplication = await AppliedJobModel.findOne({ userId, jobId });
    if (existingApplication) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already applied for this job.");
    }
    const appliedJob = await AppliedJobModel.create({
        ...payload,
        jobId,
        userId
    });
    return appliedJob
}
export const appliedJobsService = {
    createAppliedJobDB
}