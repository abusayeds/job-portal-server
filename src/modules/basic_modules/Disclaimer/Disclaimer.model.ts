import mongoose, { Schema } from "mongoose";
import { TDisclaimer } from "./Disclaimer.interface";

const disclaimerSchema = new Schema<TDisclaimer>(
  {
    description: { type: String, required: true },
  },
  { timestamps: true },
);

export const disclaimerModel =
  mongoose.models.About || mongoose.model<TDisclaimer>("Disclaimer", disclaimerSchema);

