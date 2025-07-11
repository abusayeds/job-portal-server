import { Types } from "mongoose"

export type TJobPost = {
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
    experience: "Freshers" | "1 - 2" | "2 - 4" | "4 - 6" | "8 - 10" | "10 - 15" | "15 +"
    jobType: "All" | "Full-Time" | "Part-Time" | "Internship" | "Contract" | "Soft-Skill" | "Freelance" | "Vocational" | "Apprenticeship" | "Remote"
    educations: string[];
    scheduleDate: Date
    expirationDate: Date
    jobLavel: "Entry Level" | "Mid Level" | "Expert Level"
    discription: string
    responsibilities: string
}
