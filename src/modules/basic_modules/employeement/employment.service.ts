import httpStatus from "http-status";
import AppError from "../../../errors/AppError";
import { UserModel } from "../user/user.model";
import { TEmployment } from "./employment.interface";
import { EmploymentModel } from "./employment.model";

// export const addEmploymentDB = async (payload: TEmployment, id: string) => {
//     const isExist = await EmploymentModel.findOne({ userId: id });

//     if (isExist) {
//         const result = await EmploymentModel.findOneAndUpdate(
//             { userId: id },
//             { ...payload },
//             { new: true }
//         );
//         return result;
//     } else {
//         const makeEmployment = await EmploymentModel.create({
//             ...payload,
//             userId: id,
//         });

//         await UserModel.findByIdAndUpdate(
//             id,
//             { employmentId: makeEmployment._id },
//             { new: true }
//         );

//         return makeEmployment;
//     }
// };

const addRecordDB = async (
    userId: string,
    type: "employment" | "reference",
    payload: TEmployment
) => {
    if (payload?.professional_skills?.length > 0) {
        const result = await EmploymentModel.findOneAndUpdate(
            { userId },
            { professional_skills: payload.professional_skills },
            { new: true, upsert: true }
        );
        return result
    }
    if (!type) {
        throw new AppError(httpStatus.BAD_REQUEST, " type  are required")
    }
    const updateField = type === "employment" ? "employments" : "references";
    const result = await EmploymentModel.findOneAndUpdate(
        { userId },
        { $push: { [updateField]: payload } },
        { new: true, upsert: true }
    );
    await UserModel.findByIdAndUpdate(userId, { employmentId: result._id }, { new: true })
    return result
};
const deleteRecordDB = async (
    userId: string,
    type: "employment" | "reference",
    recordId: string
) => {
    const updateField = type === "employment" ? "employments" : "references";
    return await EmploymentModel.findOneAndUpdate(
        { userId },
        { $pull: { [updateField]: { _id: recordId } } },
        { new: true }
    );
};

export const employmentService = {
    deleteRecordDB,
    addRecordDB
};

