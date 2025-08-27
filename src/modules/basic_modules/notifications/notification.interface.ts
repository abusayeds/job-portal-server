
import { Types } from "mongoose";

export type TNotification = {
  userId: Types.ObjectId | string;
  jobId?: Types.ObjectId;
  notification: string;
  isRead?: boolean;
} 
