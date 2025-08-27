import mongoose, { Schema } from "mongoose";
import { TNotification } from "./notification.interface";
const NotificationSchema: Schema = new Schema<TNotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notification: { type: String },

    isRead: { type: Boolean, default: false },
  },

  { timestamps: true },
);

export const NotificationModel = mongoose.model<TNotification>("Notification", NotificationSchema);