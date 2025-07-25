import { model, Schema } from 'mongoose';
import { TJobPost } from './jobPost.interface';




const jobPostSchema = new Schema<TJobPost>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        companyId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        subscriptionId: { type: String, required: true },
        palan: { type: Schema.Types.ObjectId, required: true, ref: 'PurchasePlanModel' },
        logo: { type: String, required: true },
        banner: { type: String, required: true },
        jobTitle: { type: String, required: true, minlength: 1 },
        location: { type: String, required: true, trim: true },
        tags: { type: [String], required: true, validate: [(arr: string[]) => arr.length >= 1, 'At least one tag is required.'] },
        minSalary: {
            type: Number,
            required: true,
            validate: {
                validator: function (value) {
                    return /^(\d+(\.\d{1,2})?)?$/.test(value);
                },
                message: 'minSalary must be a valid number with up to two decimal places.'
            },
            trim: true
        },
        maxSalary: {
            type: Number,
            required: true,
            trim: true,
            validate: {
                validator: function (value) {
                    return /^(\d+(\.\d{1,2})?)?$/.test(value);
                },
                message: 'maxSalary must be a valid number with up to two decimal places.'
            }
        },
        currency: {
            type: String,
            required: true,
            trim: true
        },
        salaryType: { type: String, required: true, trim: true, minlength: 1 },
        experience: {
            type: String,
            enum: ['Freshers', '1-2', '2-4', '4-6', '8-10', '10-15', '15+',],
            trim: true,
            required: true,
        },
        jobType: {
            type: String,
            enum: ['All', 'Full-Time', 'Part-Time', 'Internship', 'Contract', 'Soft-Skill', 'Freelance', 'Vocational', 'Apprenticeship', 'Remote',
            ],
            trim: true,
            required: true,
        },
        educations: {
            type: [String],
            enum: ['All', 'High-School', 'Intermediate', 'Graduation', 'Associate-Degree', 'Bachelor-Degree', 'Master-Degree', 'Phd',
            ],
            required: true,
            trim: true,
            validate: [(arr: string[]) => arr.length >= 1, 'At least one education is required.'],
        },
        organizationType: {
            type: String,
            enum: ["All", "Federal Government", "County Government", "City Government", "State Government", "Local Government", "NGO", "Private Company", "International Agencies", "Airport Authority"],
            required: true,
            trim: true
        },
        expirationDate: {
            type: Date,
            required: true,
            validate: {
                validator: function (value: string) {
                    const inputDate = new Date(value);
                    const now = new Date();
                    inputDate.setHours(0, 0, 0, 0);
                    now.setHours(0, 0, 0, 0);
                    return inputDate > now;
                },
                message: 'expirationDate must be a future date.'
            }
        },
        scheduleDate: {
            type: Date,
            required: false,
            default: () => new Date(),
        },

        jobLevel: {
            type: String,
            trim: true,
            enum: ['Entry-Level', 'Mid-Level', 'Expert-Level'],
            required: true,
        },
        jobBenefits: {
            type: [String],
            required: true,
        },
        description: { type: String, required: true, minlength: 1 },
        responsibilities: { type: String, required: true, minlength: 1 },
    },

    {
        timestamps: true,
    }
);

export const JobPostModel = model<TJobPost>('JobPost', jobPostSchema);