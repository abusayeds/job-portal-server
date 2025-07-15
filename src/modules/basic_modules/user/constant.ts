import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import zodValidation from "../../../middlewares/zodValidationHandler";
import { userValidation } from "./user.validation";
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


// {
//     _id: new ObjectId('68734b4dba6d90ec35edd0ea'),
//         fullName: 'Candidate 1',
//             userName: 'sayed',
//                 email: 'candidate1@gmail.com',
//                     role: 'candidate',
//                         benefits: [],
//                             isCompleted: true,
//                                 isActive: true,
//                                     isApprove: true,
//                                         isVerify: true,
//                                             step: 4,
//                                                 educations: ['High-School', 'Intermediate'],
//                                                     jobType: ['All', 'Internship'],
//                                                         jobLevel: ['Entry-Level'],
//                                                             cv: [[Object]],
//                                                                 experience: '1-2',
//                                                                     parsonalWebsite: 'https://www.facebook.com/',
//                                                                         title: 'Hello Developer',
//                                                                             biography: 'A passionate software developer with a love for coding and problem-solving. Always eager to learn and grow in the field of technology.',
//                                                                                 dateOfBrith: '2025-07-29T18:00:00.000Z',
//                                                                                     gender: 'Female',
//                                                                                         maritalStatus: 'Single',
//                                                                                             nationality: 'Bangladeshi',
//                                                                                                 address: 'heelllo ',
//                                                                                                     contactEmail: 'use@gmail.com',
//                                                                                                         phone: '16745415645',
//                                                                                                             facebook: 'https://www.facebook.com/'

// }