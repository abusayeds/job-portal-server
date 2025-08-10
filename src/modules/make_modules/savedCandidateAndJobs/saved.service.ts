/* eslint-disable @typescript-eslint/no-explicit-any */
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { UserModel } from "../../basic_modules/user/user.model";
import { JobPostModel } from "../job-post/jobPost.model";
import { SavedModel } from "./saved.model";

const savedCandidateAndJobsDB = async (role: string, userId: string, id: string) => {
    if (role === "candidate") {
        const jobs = await JobPostModel.findById(id)
        if (!jobs) {
            throw new AppError(404, "You are not a job seeker");
        }
        const existingSavedJob = await SavedModel.findOne({ userId: userId, jobId: id });
        if (existingSavedJob) {
            await SavedModel.findByIdAndDelete(existingSavedJob._id);
            return 'Job unsaved successfully';
        }
        const result = await SavedModel.create({
            userId: userId,
            jobId: id
        })
        if (!result) {
            throw new AppError(400, "Failed to save job");
        }
        return 'Job saved successfully';
    } else {
        const candidate = await UserModel.findById(id)
        if (!candidate) {
            throw new AppError(404, "You are not permitted");
        }
        const existingSavedCandidate = await SavedModel.findOne({ userId: userId, candidate: id });
        if (existingSavedCandidate) {
            await SavedModel.findByIdAndDelete(existingSavedCandidate._id);
            return 'Candidate unsaved successfully';
        }
        const result = await SavedModel.create({
            userId: userId,
            candidate: id
        })
        if (!result) {
            throw new AppError(400, "Failed to save candidate");
        }
        return "Candidate saved successfully";
    }
}

const myFavoritesDB = async (role: string, userId: string, query: Record<string, unknown>) => {
    if (role === "candidate") {
        const savedQuery = new queryBuilder(
            SavedModel.find({ userId }).populate({
                path: "jobId",
                populate: {
                    path: "companyId",
                    select: "companyName", // only fetch companyName
                },
            }),
            query
        );

        const { totalData } = await savedQuery.paginate(SavedModel.find({ userId }));
        let saveData: any = await savedQuery.modelQuery.exec();

        // Loop through saveData and restructure company info
        saveData = saveData.map((saved: any) => {
            if (saved?.jobId?.companyId) {
                saved.jobId.companyName = saved.jobId.companyId.companyName;
                delete saved.jobId.companyId; // remove full company object if needed
            }
            return saved;
        });

        const currentPage = Number(query?.page) || 1;
        const limit = Number(query?.limit) || 10;

        const pagination = savedQuery.calculatePagination({
            totalData,
            currentPage,
            limit,
        });

        return { pagination, saveData };
    } else {
        const savedQuery = new queryBuilder(
            SavedModel.find({ userId: userId }).populate({
                path: "candidate",
                populate: {
                    path: "candidateInfo",
                    // select: "title"
                }
            }),
            query
        )
        const { totalData } = await savedQuery.paginate(SavedModel.find({ userId: userId }))
        const saveData: any = await savedQuery.modelQuery.exec()


        const currentPage = Number(query?.page) || 1;
        const limit = Number(query.limit) || 10;
        const pagination = savedQuery.calculatePagination({
            totalData,
            currentPage,
            limit,
        });

        const formatData = saveData?.map((item: any) => {
            return {
                _id: item._id,
                // userId: item.userId,
                fullName: item.candidate.fullName,
                candidateId: item.candidate._id,
                title: item.candidate?.candidateInfo?.title,
                logo: item.candidate?.candidateInfo?.logo,
            };
        });


        return {
            pagination, saveData: formatData
        };
    }
}

const getAllFavoriteIds = async (role: string, userId: string): Promise<string[]> => {
    if (role === "candidate") {
        // Fetch saved jobs for the candidate
        const savedJobs = await SavedModel.find({ userId }).select("jobId").lean();
        const jobIds = savedJobs
            .map((item: any) => item?.jobId?._id || item?.jobId)
            .filter(Boolean); // remove null/undefined
        return jobIds;
    } else {
        // Fetch saved candidates for the employer
        const savedCandidates = await SavedModel.find({ userId }).select("candidate").lean();
        const candidateIds = savedCandidates
            .map((item: any) => item?.candidate?._id || item?.candidate)
            .filter(Boolean); // remove null/undefined
        return candidateIds;
    }
};
export const savedCandidateAndJobService = {
    savedCandidateAndJobsDB,
    myFavoritesDB,
    getAllFavoriteIds,
}


// "saveData": [
//     {
//         "_id": "6875dd385150703f00cd7a2f",
//         "userId": "68734c76ba6d90ec35edd10c",
//         "fullName": "Candidate 1",
//         "title": "Hello Developer"
//     }
// ]