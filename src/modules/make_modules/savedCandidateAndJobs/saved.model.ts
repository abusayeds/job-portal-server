import { Schema, model, Types, Document } from 'mongoose';

export type TSaved = {
    userId: Types.ObjectId;
    jobId: Types.ObjectId;
    candidate: Types.ObjectId;
};

export interface ISaved extends TSaved, Document { }

const SavedSchema = new Schema<ISaved>(
    {
        userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        jobId: { type: Schema.Types.ObjectId, ref: 'JobPost', required: false },
        candidate: { type: Schema.Types.ObjectId, ref: 'User', required: false },
    },
    { timestamps: true }
);

export const SavedModel = model<ISaved>('Saved', SavedSchema);