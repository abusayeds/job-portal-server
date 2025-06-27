import { model, Schema } from 'mongoose';
import { TJobPost } from './jobPost.interface';




const jobPostSchema = new Schema<TJobPost>(
    {
        userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
        subscriptionId: { type: String, required: true },
        logo: { type: String, required: true },
        bennner: { type: String, required: true },
        jobTitle: { type: String, required: true },
        tags: { type: [String], required: true },
        minSalary: { type: String, required: false },
        maxSalary: { type: String, required: false },
        salaryType: { type: String, required: false },
        education: { type: String, required: false },
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
            required: true,
        },
        expirationDate: { type: String, required: true },
        jobLavel: {
            type: String,
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