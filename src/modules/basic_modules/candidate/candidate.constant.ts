import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { candidateValidation } from "./candidate.validation";
export const candidateStepValidation = (req: Request, res: Response, next: NextFunction) => {
    const step = req.query.step;
    let schema;
    switch (step) {
        case "1":
            schema = candidateValidation.candidateStep1validation
            break;
        case "2":
            schema = candidateValidation.candidateStep2validation;
            break;
        case "3":
            schema = candidateValidation.candidateStep3validation
            break;
        case "4":
            schema = candidateValidation.candidateStep4validation;
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing step parameter")
    }
    return zodValidation(schema)(req, res, next);
};