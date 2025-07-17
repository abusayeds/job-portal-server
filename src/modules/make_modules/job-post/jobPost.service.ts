import { JobPostModel } from './jobPost.model';
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { AppliedJobModel } from "../applied-jobs/applied.jobs.model";
import { TPurchasePlan } from "../purchasePlan/purchasePlan.interface";
import { purchasePlanModel } from "../purchasePlan/purchasePlan.model";
import { searchJobs } from "./jobPost-constant";
import { TJobPost } from "./jobPost.interface";

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
    const myJobsQuery = new queryBuilder(JobPostModel.find({ userId, }), query).search(searchJobs).filter().sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find({ userId, }))
    const jobs = await myJobsQuery.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = myJobsQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    const myJobs = await Promise.all(jobs.map(async (job: TJobPost) => {
        const applyCount = await AppliedJobModel.countDocuments({ jobId: job._id });
        const expirationDate = job?.expirationDate;
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
            _id: job?._id,
            jobTitle: job?.jobTitle,
            jobType: job?.jobType,
            expirationDate: remainingTime,
            allApplication: applyCount
        }
    }));
    return { pagination, myJobs }
}
const candidateAllJobsDB = async (query: Record<string, unknown>) => {
    const myJobsQuery = new queryBuilder(JobPostModel.find(), query).search(searchJobs).filter().fields().sort()
    const { totalData } = await myJobsQuery.paginate(JobPostModel.find())
    const jobs = await myJobsQuery.modelQuery.exec()
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




const viewApplicationsDB = async (jobId: string, query: Record<string, unknown>) => {
    const jobsQuery = new queryBuilder(
        AppliedJobModel.find({ jobId }).populate([
            {
                path: "userId",
                select: "fullName",
                populate: {
                    path: "candidateInfo",
                    select: "title"
                }
            },
            {
                path: "jobId",
                select: "jobTitle",
            }
        ]),
        query
    ).sort()
    const { totalData } = await jobsQuery.paginate(AppliedJobModel.find({ jobId, }))
    const jobs = await jobsQuery.modelQuery.exec()
    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = jobsQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });


    const applications = jobs.map((application: any) => {
        return {
            _id: application._id,
            userId: application.userId._id,
            fullName: application.userId.fullName,
            title: application.userId.candidateInfo?.title || "N/A",
            coverLatter: application.coverLetter,
            appliedDate: application.createdAt
        }
    })



    return {
        pagination,
        jobTitle: jobs[0].jobId.jobTitle,
        jobs: applications
    }
}

const singleApplyJobDB = async (appliedId: string) => {
    const appliedJob = await AppliedJobModel.findById(appliedId).populate([
        {
            path: "userId",
            populate: {
                path: "candidateInfo",
            }
        },
        {
            path: "jobId",
            select: "jobTitle",
        }
    ])
    if (!appliedJob) {
        throw new AppError(httpStatus.NOT_FOUND, "Application not found");
    }
    return appliedJob

}

// const candidateJobAlertDB = async (info: any) => {
//     const result: any = [];
//     if (info?.jobType && Array.isArray(info.jobType) && info.jobType.length > 0) {
//         await Promise.all(info.jobType.map(async (type: any) => {
//             const jobs = await JobPostModel.find({ jobType: type });
//             jobs.forEach((job: any) => result.push(job));
//         }));

//     }
//     if (info?.jobLevel && Array.isArray(info.jobLevel) && info.jobLevel.length > 0) {
//         await Promise.all(info.jobLevel.map(async (level: any) => {
//             const jobs = await JobPostModel.find({ jobLevel: level });
//             jobs.forEach((job: any) => result.push(job));
//         }));
//     }

//     return result;
// };




const candidateJobAlertDB = async (info: any, page: number = 1, pageSize: number = 10) => {
    const result: any = [];
    const skip = (page - 1) * pageSize;
    const totalDataCount = await JobPostModel.countDocuments({
        $or: [
            { jobType: { $in: info.jobType || [] } },
            { jobLevel: { $in: info.jobLevel || [] } }
        ]
    });
    const totalPage = Math.ceil(totalDataCount / pageSize);
    const prevPage = page > 1 ? page - 1 : 1;
    const nextPage = page < totalPage ? page + 1 : totalPage;

    if (info?.jobType && Array.isArray(info.jobType) && info.jobType.length > 0) {
        await Promise.all(info.jobType.map(async (type: any) => {
            const jobs = await JobPostModel.find({ jobType: type })
                .skip(skip)
                .limit(pageSize)
                .exec();
            jobs.forEach((job: any) => result.push(job));
        }));
    }

    if (info?.jobLevel && Array.isArray(info.jobLevel) && info.jobLevel.length > 0) {
        await Promise.all(info.jobLevel.map(async (level: any) => {
            const jobs = await JobPostModel.find({ jobLevel: level })
                .skip(skip)
                .limit(pageSize)
                .exec();
            jobs.forEach((job: any) => result.push(job));
        }));
    }

    return {
        pagination: {
            totalPage,
            currentPage: page,
            prevPage,
            nextPage,
            totalData: totalDataCount
        },
        data: result
    };
};




export const jobService = {
    crateJobDB,
    employerAllPostedJobs,
    candidateAllJobsDB,
    viewApplicationsDB,
    singleApplyJobDB,
    candidateJobAlertDB
}


