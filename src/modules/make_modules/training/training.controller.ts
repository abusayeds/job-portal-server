
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import queryBuilder from "../../../builder/queryBuilder";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { UserModel } from "../../basic_modules/user/user.model";
import { trainingModel, trainingRagistrationModel } from "./training.model";
import { trainingService } from "./training.service";


const createtraining = catchAsync(async (req, res) => {
    const trainingData = req.body;
    const { decoded, }: any = await tokenDecoded(req, res)
    const employeeId = decoded.user._id;
    const company = await UserModel.findById(employeeId)
    const payload = {
        ...trainingData,
        employeId: employeeId,
        companyName: company.companyName,
    }
    const training = await trainingService.createtrainingDB(payload);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Training created successfully",
        data: training
    });
});



const getAlltrainings = catchAsync(async (req, res) => {

    const trainings = await trainingService.getAlltrainingsDB(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "All trainings fetched successfully",
        data: trainings
    });
});



const getEmployeetrainings = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const employeeId = decoded.user._id;
    const training = await trainingService.getEmployeetrainingsDB(employeeId, req.query);
    sendResponse(res, {
        statusCode: training ? httpStatus.OK : httpStatus.NOT_FOUND,
        success: !!training,
        message: training ? "Training fetched successfully" : "Training not found",
        data: training
    });
});



const updatetraining = catchAsync(async (req, res) => {
    const { id } = req.params;
    const training = await trainingService.updatetrainingDB(id, req.body);
    sendResponse(res, {
        statusCode: training ? httpStatus.OK : httpStatus.NOT_FOUND,
        success: !!training,
        message: training ? "Training updated successfully" : "Training not found",
        data: training
    });
});




const deletetraining = catchAsync(async (req, res) => {
    const { id } = req.params;
    const training = await trainingService.deletetrainingDB(id);
    sendResponse(res, {
        statusCode: training ? httpStatus.OK : httpStatus.NOT_FOUND,
        success: !!training,
        message: training ? "Training deleted successfully" : "Training not found",
        data: training
    });
});
const getSingletraining = catchAsync(async (req, res) => {
    const { id } = req.params;
    const training = await trainingService.getSingletrainingDB(id);
    sendResponse(res, {
        statusCode: training ? httpStatus.OK : httpStatus.NOT_FOUND,
        success: !!training,
        message: training ? "Training get successfully" : "Training not found",
        data: training
    });
});



const createTraningRagistration = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const { trainingId, employeeId } = req.body
    if (!trainingId) {
        throw new AppError(httpStatus.BAD_REQUEST, "Training id is required ")
    }
    const foundTraining = await trainingModel.findById(trainingId)
    if (!foundTraining) {
        throw new AppError(httpStatus.BAD_REQUEST, "Training not found")
    }
    if (!employeeId) {
        throw new AppError(httpStatus.BAD_REQUEST, "employeeId id is required ")
    }
    const candidateId = decoded.user._id;
    const isExist = await trainingRagistrationModel.findOne({
        userId: candidateId,
        trainingId: trainingId,
    })
    if (isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "You are already registered for this training.");
    }
    const result = await trainingRagistrationModel.create({
        userId: candidateId,
        trainingId: trainingId,
        employeeId: employeeId
    })
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Ragistration complated ! ",
        data: result
    });
})
const traningRagistrationList = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const employeeId = decoded.user._id;
    const listQuery = new queryBuilder(trainingRagistrationModel.find({ employeeId: employeeId }).populate("userId").populate("trainingId"), req.query)
    const { totalData } = await listQuery.paginate(trainingRagistrationModel.find({ employeeId: employeeId }));
    const ragistrationList = await listQuery.modelQuery.exec();
    const currentPage = Number(req.query?.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const pagination = listQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Get ragistration list ",
        data: {
            pagination, ragistrationList
        }
    });
})
const traningSpecificList = catchAsync(async (req, res) => {
    const { trainingId } = req.params;
    const isExist = await trainingModel.findById(trainingId);
    if (!isExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "Training not found!");
    }

    const listQuery = new queryBuilder(trainingRagistrationModel.find({ trainingId: trainingId }).populate([
        {
            path: "userId",
            select: "fullName email logo addess",
            populate: {
                path: "candidateInfo",
                select: "contactEmail logo phone address ",
            }
        }
    ]).populate("trainingId"), req.query);

    const { totalData } = await listQuery.paginate(trainingRagistrationModel.find({ trainingId: trainingId }));
    const ragistrationList = await listQuery.modelQuery.exec();

    ragistrationList.forEach((ragistration: any) => {
        if (ragistration.userId && ragistration.userId.candidateInfo) {
            ragistration.userId.contactEmail = ragistration.userId.candidateInfo.contactEmail;
            delete ragistration.userId.candidateInfo;
        }
    });

    const currentPage = Number(req.query?.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const pagination = listQuery.calculatePagination({
        totalData,
        currentPage,
        limit,
    });

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Get training-specific list",
        data: {
            pagination,
            trainingName: isExist.title,
            ragistrationList
        }
    });
});






export const trainingController = {
    createtraining,
    getAlltrainings,
    getEmployeetrainings,
    getSingletraining,
    updatetraining,
    deletetraining,
    createTraningRagistration,
    traningRagistrationList,
    traningSpecificList
};