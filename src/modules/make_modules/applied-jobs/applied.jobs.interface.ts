import { Types } from "mongoose";

export type TAppliedJob = {
    jobId: Types.ObjectId;
    userId: Types.ObjectId;
    coverLetter: string;
} & Document;