import { Schema, model, Document } from 'mongoose';

export interface IJobAlert extends Document {
    userId: string;
    keywords: string[];
    location?: string;
    frequency: 'daily' | 'weekly' | 'monthly';
    createdAt: Date;
    updatedAt: Date;
}

const jobAlertSchema = new Schema<IJobAlert>(
    {
        userId: { type: String, required: true, index: true },
        keywords: { type: [String], required: true },
        location: { type: String },
        frequency: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    },
    {
        timestamps: true,
    }
);

export const JobAlert = model<IJobAlert>('JobAlert', jobAlertSchema);