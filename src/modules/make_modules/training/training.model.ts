import { model, Schema } from "mongoose";
import { Ttraining } from "./training.interface";

const trainingSchema = new Schema<Ttraining>({
    employeId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    companyName: { type: String, required: true, trim: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    date: {
        type: String,
        required: true,
        trim: true,
        get: (val: Date) => val ? val.toISOString().split('T')[0] : val,
        set: (val: string) => {
            const date = new Date(val);
            return date instanceof Date && !isNaN(date.getTime()) ? date.toISOString().split('T')[0] : val;
        }
    },
    category: {
        type: String, required: true, trim: true,
        enum: ["Job Training", "Professional Development", "Job Fair"]
    },
    format: {
        type: String,
        required: true,
        trim: true,
        enum: ["online", "in_person"]
    },
    duration: { type: String },
    address: { type: String },
    Instructor: { type: String },
    learning_credits: { type: String },
    time: [{ type: String, required: true }],
    description: { type: String, required: true }
}, {
    timestamps: true
}
);

export const trainingModel = model<Ttraining>("Training", trainingSchema);


const trainingRagistration = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    employeeId: { type: Schema.Types.ObjectId, ref: "User" },
    trainingId: { type: Schema.Types.ObjectId, ref: "Training" }
},
    {
        timestamps: true
    })

export const trainingRagistrationModel = model("Ragistration", trainingRagistration);