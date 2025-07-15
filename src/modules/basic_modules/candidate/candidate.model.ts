import mongoose, { Schema } from "mongoose";
import { TCandidate } from "./candidate.interface";
const cvItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    file: { type: String, required: true }
},
    { timestamps: true }
);
const candidateSchema = new Schema<TCandidate>({
    email: { type: String, required: false },
    logo: { type: String, required: false },
    title: { type: String, required: false },
    experience: {
        type: String,
        enum: ["Freshers", "1-2", "2-4", "4-6", "8-10", "10-15", "15 +"],
        required: false
    },
    educations: {
        type: [String],
        enum: [
            'All',
            'High-School',
            'Intermediate',
            'Graduation',
            'Associate-Degree',
            'Bachelor-Degree',
            'Master-Degree',
            'Phd',
        ],
        required: true,
        trim: true,
    },
    parsonalWebsite: { type: String, required: false },
    cv: {
        type: [cvItemSchema],
        required: false
    },
    // step 2
    nationality: { type: String, required: false },
    dateOfBrith: { type: String, required: false },
    gender: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    biography: { type: String, required: false },
    // step 3
    facebook: { type: String, trim: true },
    twitter: { type: String, trim: true },
    youtube: { type: String, trim: true },
    instagram: { type: String, trim: true },
    linkedin: { type: String, trim: true },
    // Step 3     
    address: { type: String, required: false },
    phone: { type: String, required: false },
    contactEmail: { type: String, required: false },
    jobType: {
        type: [String],
        enum: [
            'All',
            'Full-Time',
            'Part-Time',
            'Internship',
            'Contract',
            'Soft-Skill',
            'Freelance',
            'Vocational',
            'Apprenticeship',
            'Remote',
        ],
        trim: true,
        required: false,
    },
    jobLevel: {
        type: [String],
        trim: true,
        enum: ['Entry-Level', 'Mid-Level', 'Expert-Level'],
        required: false,
    },
});


export const candidateModel = mongoose.model<TCandidate>('Candidate', candidateSchema);

