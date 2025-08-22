/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { employmentService } from "./employment.service";

// export const addEmployment = catchAsync(async (req, res) => {
//     const { decoded }: any = await tokenDecoded(req, res);
//     const id = decoded.user._id;
//     const result = await employmentService.addEmploymentDB(req.body, id)

// sendResponse(res, {
//     success: true,
//     statusCode: httpStatus.OK,
//     message: " Employment added ! ",
//     data: result,
// });
// });


const addRecord = catchAsync(async (req, res) => {
    const { type } = req.query;
    const payload = req.body;
    const { decoded }: any = await tokenDecoded(req, res);
    const userId = decoded.user._id;


    const result = await employmentService.addRecordDB(userId as string, type as any, payload);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `${type} added successfully`,
        data: result,
    });

})


export const deleteRecord = catchAsync(async (req, res) => {
    const { type, recordId } = req.query;
    const { decoded }: any = await tokenDecoded(req, res);
    const userId = decoded.user._id;
    if (!type || !recordId) {
        throw new AppError(httpStatus.BAD_REQUEST, " type and recordId are required")
    }
    const result = await employmentService.deleteRecordDB(
        userId as string,
        type as any,
        recordId as string
    );
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: `${type} deleted successfully`,
        data: result,
    });
})

export const employmentController = {
    deleteRecord,
    addRecord
}