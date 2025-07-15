import { Types } from "mongoose"

export type TSaved = {
    userId: Types.ObjectId
    jobId: Types.ObjectId
    candidate: Types.ObjectId
}