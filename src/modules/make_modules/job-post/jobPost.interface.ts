import { Types } from "mongoose"

export type TJobPost = {
    _id?: Types.ObjectId
    userId: Types.ObjectId,
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
    educations: string[];
    organizationType: "All" | "Federal Government" | "County Government" | "City Government" | "State Government" | "Local Government" | "NGO" | "Private Company" | "International Agencies" | "Airport Authority"
    scheduleDate: Date
    expirationDate: Date
    jobLevel: "Entry Level" | "Mid Level" | "Expert Level"
    description: string
    responsibilities: string
}
