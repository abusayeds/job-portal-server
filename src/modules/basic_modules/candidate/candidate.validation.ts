import { z } from "zod";

const candidateStep1validation = z.object({
    body: z.object({
        image: z.string({ required_error: "Profile image is required" }),
        title: z.string({ required_error: "Title is required" }),
        experience: z.enum(["Freshers", "1-2", "2-4", "4-6", "8-10", "10-15", "15+"], { required_error: "Experience is required" }),
        educations: z.array(z.string()).min(1, { message: "At least one benefit is required" }),
        parsonalWebsite: z.string().optional(),
        cv: z.array(z.string(), { required_error: "CV is required" }),
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
        biography: z.string({ required_error: "Biography is required" }),
    }),
});




export const candidateValidation = {
    candidateStep1validation,
    candidateStep2validation,
    candidateStep4validation,
    candidateStep3validation
};