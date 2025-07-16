import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { JobPostModel } from "../job-post/jobPost.model";
import { SavedModel } from "../savedCandidateAndJobs/saved.model";
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
const getMyAppliedJobsDB = async (userId: string, query: Record<string, unknown>) => {

    const appliedJobQuery = new queryBuilder(AppliedJobModel.find({ userId }).populate("jobId"), query).fields().sort()
    const { totalData } = await appliedJobQuery.paginate(AppliedJobModel.find({ userId }))
    const jobs = await appliedJobQuery.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = appliedJobQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    const appliedJobs = jobs.map((job: TAppliedJob) => {
        const expirationDate = job?.jobId?.expirationDate;
        let remainingTime: string | Date = expirationDate;
        if (expirationDate) {
            const now = new Date();
            const expDate = new Date(expirationDate);
            const diff = expDate.getTime() - now.getTime();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                remainingTime = `${days}d ${hours}h  remaining`;
            }
        }

        return {
            _id: job._id,
            jobId: job?.jobId?._id,
            jobTitle: job?.jobId?.jobTitle,
            logo: job?.jobId?.logo,
            companyName: job?.jobId?.companyName,
            banner: job?.jobId?.banner,
            jobType: job?.jobId?.jobType,
            jobLevel: job?.jobId?.jobLevel,
            expirationDate: remainingTime
        }
    })
    return {
        pagination, appliedJobs
    }
}

const overviewDB = async (userId: string, role: string) => {
    let overviewData;
    if (role === "candidate") {
        const appliedJobs = await AppliedJobModel.find({ userId }).countDocuments();
        const favoritesjobs = await SavedModel.find({ userId }).countDocuments();
        overviewData = {
            appliedJobs,
            favoritesjobs,
            jobAlerts: 0,
        };
        return overviewData;
    } else {
        const now = new Date();
        const openJobs = await JobPostModel.find({ expirationDate: { $gt: now } }).countDocuments();
        const expriredJobs = await JobPostModel.find({ expirationDate: { $lte: now } }).countDocuments();
        const saveCandidate = await SavedModel.find({ userId }).countDocuments();
        overviewData = {
            openJobs,
            expriredJobs,
            saveCandidate,
        };
        return overviewData;
    }
}

export const appliedJobsService = {
    createAppliedJobDB,
    getMyAppliedJobsDB,
    overviewDB
} 