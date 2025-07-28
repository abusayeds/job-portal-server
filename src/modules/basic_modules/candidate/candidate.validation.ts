/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";
import { JobLevels, JobTypes } from "../../make_modules/job-post/jobPost.interface";

const candidateStep1validation = z.object({
    body: z.object({
        logo: z.string({ required_error: "Profile image is required" }),
        title: z.string({ required_error: "Title is required" }),
        experience: z.enum(["Freshers", "1-2", "2-4", "4-6", "8-10", "10-15", "15+"], { required_error: "Experience is required" }),
        educations: z.array(z.string()).min(1, { message: "At least one benefit is required" }),
        parsonalWebsite: z.string().optional(),
    }),
});
const candidateStep2validation = z.object({
    body: z.object({
        nationality: z.string({ required_error: "Nationality is required" }),
        dateOfBrith: z.string({ required_error: "DateOfBrith number is required" }),
        gender: z
            .string({ required_error: "Gender email is required" })
            .trim(),
        maritalStatus: z.string({ required_error: "Profile image is required" }),
        biography: z.string({ required_error: "Biography is required" }),
    }),
});
const candidateStep3validation = z.object({
    body: z.object({
        facebook: z
            .string()
            .trim()
            .url({ message: "Please enter a valid URL in the Facebook field." })
            .optional(),
        twitter: z
            .string()
            .trim()
            .url({ message: "Please enter a valid URL in the Twitter field." })
            .optional(),

        youtube: z
            .string()
            .trim()
            .url({ message: "Please enter a valid URL in the YouTube field." })
            .optional(),

        instagram: z
            .string().trim()
            .url({ message: "Please enter a valid URL in the Instagram field." })
            .optional(),

        linkedin: z
            .string()
            .trim()
            .url({ message: "Please enter a valid URL in the LinkedIn field." })
            .optional(),
    }),
});
const candidateStep4validation = z.object({
    body: z.object({
        address: z.string({ required_error: "Address is required" }),
        phone: z.string({ required_error: "Phone number is required" }),
        contactEmail: z
            .string({ required_error: "Contact email is required" })
            .trim()
            .email({ message: "Contact email must be valid" }),

    })
});


const candidateJobAlertValidation = z.object({
    body: z.object({
        jobType: z.array(z.enum(JobTypes as [string, ...string[]]), { required_error: "Job type is required" }),
        jobLevel: z.array(z.enum(JobLevels as [string, ...string[]]), { required_error: "Job level is required" }).optional(),
    }),
});





export const candidateValidation = {
    candidateStep1validation,
    candidateStep2validation,
    candidateStep4validation,
    candidateStep3validation,
    candidateJobAlertValidation
};