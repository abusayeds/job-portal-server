import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { TPurchasePlan } from "../purchasePlan/purchasePlan.interface";
import { purchasePlanModel } from "../purchasePlan/purchasePlan.model";
import { searchJobs } from "./jobPost-constant";
import { TJobPost } from "./jobPost.interface";
import { JobPostModel } from "./jobPost.model";

const crateJobDB = async (userId: string, subscriptionId: string, palan: string, payload: TJobPost) => {


    const subs_palan: TPurchasePlan | null = await purchasePlanModel.findOne({ _id: palan, subscriptionId: subscriptionId });
    const jobs = await JobPostModel.find({ subscriptionId: subscriptionId })

    if (subs_palan && jobs.length > 0 && subs_palan.planName !== "unlimited_plan") {
        const jobpostCount = Number(subs_palan.jobpost);
        if (jobpostCount <= jobs.length) {
            throw new AppError(httpStatus.BAD_REQUEST, "This subscription limit has ended.");
        }
    }

    if (!subs_palan) {
        throw new AppError(httpStatus.NOT_FOUND, "Subscription not found ! ")
    }
    if (payload.logo && !payload.logo.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
    }
    if (payload.banner && !payload.banner.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid banner path");
    }
    const jobData = {
        ...payload,
        userId,
        subscriptionId,
        palan
    }

    const result = await JobPostModel.create(jobData)
    return result

}
const employerAllPostedJobs = async (userId: string, query: Record<string, unknown>) => {
    const myJobsQuery = new queryBuilder(JobPostModel.find({ userId, }), query).sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find({ userId, }))
    const jobs = await myJobsQuery.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = myJobsQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    const myJobs = jobs.map((job: TJobPost) => {
        return {
            jobTitle: job?.jobTitle,
            jobType: job?.jobType,
            expirationDate: job?.expirationDate,
            allApplication: 0
        }
    })
    return { pagination, myJobs }
}
const candidateAllJobsDB = async (query: Record<string, unknown>) => {
    const myJobsQuery = new queryBuilder(JobPostModel.find(), query).search(searchJobs).filter().fields().sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find())
    const jobs = await myJobsQuery.modelQuery.exec()
    console.log(jobs);

    const allJobs = jobs.map((job: TJobPost) => {
        const expirationDate = job?.expirationDate;
        let remainingTime: string | Date = expirationDate;
        if (expirationDate) {
            const now = new Date();
            const expDate = new Date(expirationDate);
            const diff = expDate.getTime() - now.getTime();
            if (diff > 0) {
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                const minutes = Math.floor((diff / (1000 * 60)) % 60);
                remainingTime = `${days}d ${hours}h ${minutes}m remaining`;
            }
        }

        return {
            _id: job._id,
            jobTitle: job?.jobTitle,
            logo: job?.logo,
            banner: job?.banner,
            jobType: job?.jobType,
            jobLevel: job?.jobLevel,
            expirationDate: remainingTime,
            totalApplication: 0,
        }
    })
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = myJobsQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    return { pagination, allJobs }
}


export const jobService = {
    crateJobDB,
    employerAllPostedJobs,
    candidateAllJobsDB
}