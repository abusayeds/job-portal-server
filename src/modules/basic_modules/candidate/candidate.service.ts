import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { TCandidate } from "./candidate.interface";
import { candidateModel } from "./candidate.model";

const candidateIdentityVerificationDB = async (email: string, payload: TCandidate, step: string) => {

    console.log(email);

    if (payload.logo && !payload.logo.startsWith('/images/')) {
        throw new AppError(httpStatus.BAD_REQUEST, "Invalid image path");
    }

    let result;
    switch (step) {
        case '1':
        case '2':
        case '3':
        case '4':
            result = await candidateModel.findOneAndUpdate({ email: email }, { $set: { ...payload } }, { new: true });
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid step");
    }
    return result;
}

export const camdidateIIdentityVerificationService = {
    candidateIdentityVerificationDB
}