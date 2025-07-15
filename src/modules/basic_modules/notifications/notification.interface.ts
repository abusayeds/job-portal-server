
import { Document, Types } from "mongoose";

// Define the INotification type
export type INotification = {
  userId: Types.ObjectId;
  jobId?: Types.ObjectId;
  notification: string;
} & Document;
