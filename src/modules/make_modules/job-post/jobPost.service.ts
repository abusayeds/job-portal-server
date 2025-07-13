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
const myJobsDB = async (userId: string, query: Record<string, unknown>) => {
    const myJobsQuery = new queryBuilder(JobPostModel.find({ userId, expirationDate: { $gte: new Date() } }), query).sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find({ userId, expirationDate: { $gte: new Date() } }))
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
const getAllJobsDB = async (query: Record<string, unknown>) => {
    const myJobsQuery = new queryBuilder(JobPostModel.find({ expirationDate: { $gte: new Date() } }), query).search(searchJobs).filter().fields().sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find({ expirationDate: { $gte: new Date() } }))
    const jobs = await myJobsQuery.modelQuery.exec()


    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = myJobsQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    return { pagination, jobs }
}


export const jobService = {
    crateJobDB,
    myJobsDB,
    getAllJobsDB
}