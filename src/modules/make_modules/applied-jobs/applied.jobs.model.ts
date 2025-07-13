import { Schema, model } from "mongoose";
import { TAppliedJob } from "./applied.jobs.interface";

const AppliedJobSchema = new Schema<TAppliedJob>({
    jobId: { type: Schema.Types.ObjectId, ref: "JobPost", required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    coverLetter: { type: String, required: true },
}, {
    timestamps: true,
});

export const AppliedJobModel = model<TAppliedJob>("AppliedJob", AppliedJobSchema);
