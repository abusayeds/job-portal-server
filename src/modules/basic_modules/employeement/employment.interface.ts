// Employment interface

import { Types } from "mongoose";

export interface EmploymentRecord {
    id?: number;
    title: string;
    company: string;
    jobLocation: string;
    startDate: string;
    endDate: string | null;
    resignation: boolean;
    jobDuties: string;
}

export interface ReferenceFormData {
    referenceType: "personal" | "professional";
    organizationName: string;
    contactName: string;
    email: string;
    phoneNumber: string;
}

export interface TEmployment {
    userId: Types.ObjectId
    employments: EmploymentRecord[];
    references: ReferenceFormData[];
    professional_skills: string[]
}