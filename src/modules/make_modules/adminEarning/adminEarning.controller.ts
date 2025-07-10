import httpStatus from "http-status";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { adminEarningService } from "./adminEarning.service";

const adminEarning = catchAsync(async (req, res) => {
    const { year } = req.params
    const result = await adminEarningService.adminEarningDB(year)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin earning get successfully',
        data: result
    });
})
const earningList = catchAsync(async (req, res) => {
    const result = await adminEarningService.earningListDB(req.query)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' Earning list get successfully',
        data: result
    });
})
const showEarning = catchAsync(async (req, res) => {
    const result = await adminEarningService.showEarningDB()
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: ' Earning list get successfully',
        data: result
    });
})
export const adminEarningController = {
    adminEarning,
    earningList,
    showEarning
}