import mongoose, { Schema } from "mongoose";
import { INotification } from "./notification.interface";
const NotificationSchema: Schema = new Schema<INotification>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    notification: { type: String },
    isRead: {type: Boolean, default: false},
  },

  { timestamps: true },
);

export const NotificationModel =
  mongoose.models.Notification ||
  mongoose.model<INotification>("Notification", NotificationSchema);