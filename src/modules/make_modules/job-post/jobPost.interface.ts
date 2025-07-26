import { Types } from "mongoose";

type IEducation = "All" | "High-School" | "Intermediate" | "Graduation" | "Associate-Degree" | "Bachelor-Degree" | "Master-Degree" | "Phd";
export const Educations: IEducation[] = ['All', 'High-School', 'Intermediate', 'Graduation', 'Associate-Degree', 'Bachelor-Degree', 'Master-Degree', 'Phd'];

type IJobLevel = 'Entry-Level' | 'Mid-Level' | 'Expert-Level';
export const JobLevels: IJobLevel[] = ['Entry-Level', 'Mid-Level', 'Expert-Level']

export type TJobPost = {
    _id?: Types.ObjectId
    userId: Types.ObjectId,
    companyId: Types.ObjectId,
    subscriptionId: string
    palan: Types.ObjectId,
    logo: string,
    banner: string,
    jobTitle: string,
    tags: string[]
    jobBenefits: string[]
    minSalary: number,
    currency: string
    maxSalary: number,
    salaryType: string
    location: string
    experience: "Freshers" | "1 - 2" | "2 - 4" | "4 - 6" | "8 - 10" | "10 - 15" | "15 +"
    jobType: "All" | "Full-Time" | "Part-Time" | "Internship" | "Contract" | "Soft-Skill" | "Freelance" | "Vocational" | "Apprenticeship" | "Remote"
    educations: [IEducation];
    organizationType: "All" | "Federal Government" | "County Government" | "City Government" | "State Government" | "Local Government" | "NGO" | "Private Company" | "International Agencies" | "Airport Authority"
    scheduleDate: Date
    expirationDate: Date
    jobLevel: IJobLevel
    description: string
    responsibilities: string
}
