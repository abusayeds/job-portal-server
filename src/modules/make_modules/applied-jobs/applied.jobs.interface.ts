/* eslint-disable @typescript-eslint/no-explicit-any */
import { Types } from "mongoose";

export type TAppliedJob = {
    _id?: Types.ObjectId;
    jobId: Types.ObjectId | any;
    userId: Types.ObjectId;
    coverLetter: string;
     createdAt?: Date;
} & Document;