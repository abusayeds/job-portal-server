import mongoose, { Schema } from "mongoose";
import { IRefund } from "./refund.interface";

const RefundSchema = new Schema<IRefund>(
  {
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const RefundModel =
  mongoose.models.Refund || mongoose.model<IRefund>("Refund", RefundSchema);
