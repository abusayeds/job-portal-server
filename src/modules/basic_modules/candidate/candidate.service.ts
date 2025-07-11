import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TCandidate } from "./candidate.interface";
import { candidateModel } from "./candidate.model";

const candidateIdentityVerificationDB = async (id: string, payload: TCandidate, step: string) => {
    if (payload.image && !payload.image.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid logo path");
    }
    if (payload.cv && Array.isArray(payload.cv)) {
        payload.cv.forEach((cvItem) => {
            if (!cvItem.startsWith('/images/')) {
                throw new AppError(httpStatus.BAD_REQUEST, "Each CV path must start with '/images/'");
            }
        });
    }

    let result;
    switch (step) {
        case '1':
        case '2':
        case '3':
        case '4':
            result = await candidateModel.findByIdAndUpdate(id, { ...payload }, { new: true });
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid step");
    }
    return result;
}

export const camdidateIIdentityVerificationService = {
    candidateIdentityVerificationDB
}