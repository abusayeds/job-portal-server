import { model, Schema } from 'mongoose';
import { TJobPost } from './jobPost.interface';




const jobPostSchema = new Schema<TJobPost>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        subscriptionId: { type: String, required: true },
        palan: { type: Schema.Types.ObjectId, required: true, ref: 'PurchasePlanModel' },
        logo: { type: String, required: true },
        banner: { type: String, required: true },
        jobTitle: { type: String, required: true },
        tags: { type: [String], required: true },
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
        salaryType: { type: String, required: true, trim: true, },
        education: { type: String, required: true },
        experience: {
            type: String,
            enum: [
                'Freshers',
                '1 - 2 Years',
                '2 - 4 Years',
                '4 - 6 Years',
                '8 - 10 Years',
                '10 - 15 Years',
                '15 + Years',
            ],
            trim: true,
            required: true,
        },
        jobType: {
            type: String,
            enum: [
                'All',
                'Full Time',
                'Part Time',
                'Internship',
                'Contract',
                'Soft Skill',
                'Freelance',
                'Vocational',
                'Apprenticeship',
                'Remote',
            ],
            trim: true,
            required: true,
        },
        organizationTyper: {
            type: String,
            enum: [
                'All',
                'High School',
                'Intermediate',
                'Graduation',
                'Associate Degree',
                'Bachelor Degree',
                'Master Degree',
                'Phd',
            ],
            trim: true,
            required: true,
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
            type: Date, required: false, validate: {
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
        jobLavel: {
            type: String,
            trim: true,
            enum: ['Entry Level', 'Mid Level', 'Expert Level'],
            required: true,
        },
        discription: { type: String, required: true },
        responsibilities: { type: String, required: true },
    },

    {
        timestamps: true,
    }
);

export const JobPostModel = model<TJobPost>('JobPost', jobPostSchema);