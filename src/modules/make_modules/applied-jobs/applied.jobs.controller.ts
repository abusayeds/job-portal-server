/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";
import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { appliedJobsService } from "./applied.jobs.service";

const createAppliedJob = catchAsync(async (req, res) => {
    const { decoded, }: any = await tokenDecoded(req, res)
    const userId = decoded.user._id;
    const { jobId } = req.params
    const appliedJob = await appliedJobsService.createAppliedJobDB(req.body, userId, jobId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "Applied Successfully",
        data: appliedJob
    })
})

export const appliedJobController = {
    createAppliedJob
}