import { Types } from "mongoose"

export type TJobPost = {
    userId: Types.ObjectId,
    subscriptionId: string
    palan: Types.ObjectId,
    logo: string,
    banner: string,
    jobTitle: string,
    tags: string[]
    minSalary: number,
    maxSalary: number,
    salaryType: string
    education: string,
    experience: "Freshers" | "1 - 2 Years" | "2 - 4 Years" | "4 - 6 Years" | "8 - 10 Years" | "10 - 15 Years" | "15 + Years"
    jobType: "All" | "Full Time" | "Part Time" | "Internship" | "Contract" | "Soft Skill" | "Freelance" | "Vocational" | "Apprenticeship" | "Remote"
    organizationTyper: "All" | "High School" | "Intermediate" | "Graduation" | "Associate Degree" | "Bachelor Degree" | "Master Degree" | "Phd"
    scheduleDate: Date
    expirationDate: Date
    jobLavel: "Entry Level" | "Mid Level" | "Expert Level"
    discription: string
    responsibilities: string
}
