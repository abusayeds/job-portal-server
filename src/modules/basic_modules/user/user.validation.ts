/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

function enumWithCustomError<T extends readonly string[]>(
  values: T,
  errorMessage: string
) {
  return z
    .string()
    .refine((val) => values.includes(val), {
      message: errorMessage,
    }) as z.ZodType<T[number], any, string>;
}

const organizationTypes = [
  "All",
  "Federal Government",
  "County Government",
  "City Government",
  "State Government",
  "Local Government",
  "NGO",
  "Private Company",
  "International Agencies",
  "Airport Authority",
] as const;

const industries = [
  "Technical & Engineering",
  "Business & Finance",
  "Sales, Marketing & Customer Service",
  "Education & Training",
  "Legal & Government",
] as const;

const employerStep1Schema = z.object({
  body: z.object({
    logo: z.string({ required_error: "Logo is required" }),
    banner: z.string({ required_error: "Banner is required" }),
    companyName: z.string({ required_error: "Company name is required" }),
    about: z.string({ required_error: "About section is required" }),
  }),
});

const employerStep2Schema = z.object({
  body: z.object({
    organizationType: enumWithCustomError(
      organizationTypes,
      "Organization type is invalid. Please select a valid option."
    ).refine(val => val.length > 0, { message: "Organization type is required" }),
    industry: enumWithCustomError(
      industries,
      "Industry is invalid. Please select a valid option."
    ).refine(val => val.length > 0, { message: "Industry is required" }),
    foundIn: z.string({ required_error: "Found in field is required" }).trim().nonempty({ message: "Found in field is required" }),
    teamSize: z
      .number({ required_error: "Team size is required", invalid_type_error: "Team size must be a number" })
      .int({ message: "Team size must be an integer" }),
    companyWebsite: z.string()
      .url({ message: "Company Website URL must be valid" })
      .optional(),
    companyVision: z.string({ required_error: "Company vision is required" }),
    benefits: z.array(z.string()).min(1, { message: "At least one benefit is required" })
  }),
});

const employerStep3Schema = z.object({
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




const employerStep4Schema = z.object({
  body: z.object({
    address: z.string({ required_error: "Address is required" }),
    phone: z.string({ required_error: "Phone number is required" }),
    contactEmail: z
      .string({ required_error: "Contact email is required" })
      .trim()
      .email({ message: "Contact email must be valid" }),
  }),
});

export const userValidation = {
  employerStep1Schema,
  employerStep2Schema,
  employerStep3Schema,
  employerStep4Schema,
};
