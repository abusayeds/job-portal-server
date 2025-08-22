import { Schema, model } from "mongoose";
import { EmploymentRecord, ReferenceFormData, TEmployment } from "./employment.interface";

const employmentRecordSchema = new Schema<EmploymentRecord>({
    title: { type: String, required: true },
    company: { type: String, required: true },
    jobLocation: { type: String, required: true },
    startDate: { type: String, required: true },
    endDate: { type: String, default: null },
    resignation: { type: Boolean, required: true },
    jobDuties: { type: String, required: true },
});

const referenceFormSchema = new Schema<ReferenceFormData>({
    referenceType: {
        type: String,
        enum: ["personal", "professional"],
        required: true,
    },
    organizationName: { type: String, required: true },
    contactName: { type: String, required: true },
    email: { type: String, required: true },
    phoneNumber: { type: String, required: true },
});

const employmentSchema = new Schema<TEmployment>(
    {
        userId: { type: Schema.Types.ObjectId, required: true },
        employments: { type: [employmentRecordSchema], required: true },
        references: { type: [referenceFormSchema], required: true },
        professional_skills: { type: [String], required: true },
    },
    { timestamps: true }
);

export const EmploymentModel = model<TEmployment>("Employeement", employmentSchema);

