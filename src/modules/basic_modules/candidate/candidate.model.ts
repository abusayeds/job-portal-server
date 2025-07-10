import mongoose, { Schema } from "mongoose";
import { TCandidate } from "./candidate.interface";

const candidateSchema = new Schema<TCandidate>({
    profileImage: { type: String, required: false },
    title: { type: String, required: false },
    experience: {
        type: String,
        enum: ["Freshers", "1 - 2", "2 - 4", "4 - 6", "8 - 10", "10 - 15", "15 +"],
        required: false
    },
    educations: {
        type: String,
        enum: [
            "All", "High-School", "Intermediate", "Graduation", "Associate-Degree",
            "Bachelor-Degree", "Master-Degree", "Phd"
        ],
        required: false
    },
    parsonalWebsite: { type: String, required: false },
    cv: { type: [String], required: false },
    // step 2
    nationality: { type: String, required: false },
    dateOfBrith: { type: String, required: false },
    gender: { type: String, required: false },
    maritalStatus: { type: String, required: false },
    biography: { type: String, required: false },
    // Step 3     
    address: { type: String, required: false },
    phone: { type: String, required: false },
    contactEmail: { type: String, required: false },
    jobType: { type: String, required: false },
    jobLevel: { type: String, required: false }
});


export const candidateModel = mongoose.model<TCandidate>('Candidate', candidateSchema);

