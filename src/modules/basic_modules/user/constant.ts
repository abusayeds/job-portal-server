import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { userValidation } from "./user.validation";
import { IUser } from "./user.interface";
export const conditionalStepValidation = (req: Request, res: Response, next: NextFunction) => {
    const step = req.query.step;
    let schema;
    switch (step) {
        case "1":
            schema = userValidation.employerStep1Schema;
            break;
        case "2":
            schema = userValidation.employerStep2Schema;
            break;
        case "3":
            schema = userValidation.employerStep3Schema;
            break;
        case "4":
            schema = userValidation.employerStep4Schema;
            break;
        default:
            throw new AppError(httpStatus.BAD_REQUEST, "Invalid or missing step parameter")
    }
    return zodValidation(schema)(req, res, next);
};

export const freeJobPostEmails = [
    "info@aplusbuz.com",  //   A Plus Business Consulting Ltd 
    "ontimetutor.info@gmail.com",  //  OntimeTutor 
    "koboservices.info@gmail.com",  //  KOBOServices
]

export const searchUser: Array<keyof IUser> = ["userName", "companyVision", "industry", "address", "companyName", "fullName",]






