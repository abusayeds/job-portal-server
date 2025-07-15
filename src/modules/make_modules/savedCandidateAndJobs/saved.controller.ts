/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status";

import { tokenDecoded } from "../../../middlewares/decoded";
import catchAsync from "../../../utils/catchAsync";
import sendResponse from "../../../utils/sendResponse";
import { savedCandidateAndJobService } from "./saved.service";

const savedCandidateAndJobs = catchAsync(async (req, res) => {
    const { decoded }: any = await tokenDecoded(req, res);
    const role = decoded.user.role;
    const userId = decoded.user._id;
    const { id } = req.params
    const sms = await savedCandidateAndJobService.savedCandidateAndJobsDB(role, userId, id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: sms,
        data: null
    });
})
const myFavorites = catchAsync(async (req, res) => {
    const { decoded }: any = await tokenDecoded(req, res);
    const role = decoded.user.role;
    const userId = decoded.user._id;

    const result = await savedCandidateAndJobService.myFavoritesDB(role, userId, req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My Favorites retrieved successfully",
        data: result
    });
})
export const savedCandidateAndJobsController = {
    savedCandidateAndJobs,
    myFavorites
}