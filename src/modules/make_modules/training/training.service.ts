
/* eslint-disable @typescript-eslint/no-explicit-any */

import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { searchtraining } from "./training.constant";
import { Ttraining } from "./training.interface";
import { trainingModel, trainingRagistrationModel } from "./training.model";


const createtrainingDB = async (payload: Ttraining) => {
    if (payload.image && !payload.image.startsWith("/images/")) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid image path");
    }
    const training = await trainingModel.create(payload);
    return training;
};

const getAlltrainingsDB = async (query: any) => {
    const trainingQuery = new queryBuilder(trainingModel.find().populate({ path: "employeId", select: "companyName companyWebsite contactEmail address logo " }), query)
        .search(searchtraining)
        .fields()
        .filter()
        .sort();
    const { totalData } = await trainingQuery.paginate(trainingModel.find());
    const trainings = await trainingQuery.modelQuery.exec();

    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = trainingQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });

    return {
        pagination,
        trainings,
    };
};
const getEmployeetrainingsDB = async (employeeId: string, query: any) => {
    const trainingQuery = new queryBuilder(trainingModel.find({ employeId: employeeId }).populate({ path: "employeId", select: "companyName companyWebsite contactEmail address logo " }), query)
        .search(searchtraining)
        .fields()
        .filter()
        .sort();
    const { totalData } = await trainingQuery.paginate(trainingModel.find({ employeId: employeeId }));
    const trainings = await trainingQuery.modelQuery.exec();

    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = trainingQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });

    return {
        pagination,
        trainings,
    };
};
const myAppliedTrainingDB = async (userId: string, query: any) => {
    const trainingQuery = new queryBuilder(trainingRagistrationModel.find({ userId: userId }).populate("trainingId"), query)
        .fields()
        .filter()
        .sort();
    const { totalData } = await trainingQuery.paginate(trainingRagistrationModel.find({ userId: userId }));
    const trainings = await trainingQuery.modelQuery.exec();

    const currentPage = Number(query?.page) || 1;
    const limit = Number(query.limit) || 10;
    const pagination = trainingQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });

    return {
        pagination,
        trainings,
    };
};
const getSingletrainingDB = async (id: string) => {
    const training = await trainingModel.findById(id).populate({ path: "employeId", select: "companyName companyWebsite contactEmail address logo " });
    return training;
};

const updatetrainingDB = async (id: string, payload: Partial<Ttraining>) => {
    const training = await trainingModel.findByIdAndUpdate(id, payload, { new: true });
    return training;
};

const deletetrainingDB = async (id: string) => {
    const training = await trainingModel.findByIdAndDelete(id);
    return training;
};
export const trainingService = {
    createtrainingDB,
    getAlltrainingsDB,
    getEmployeetrainingsDB,
    updatetrainingDB,
    deletetrainingDB,
    getSingletrainingDB,
    myAppliedTrainingDB
};