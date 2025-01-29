import mongoose from "mongoose";

const scheduledMessageSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audioHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AudioHistory",
      required: true,
    },
    whatsappNumber: {
      type: String,
      required: true,
    },
    callNumber: {
      type: String,
    },
    scheduledTime: {
      type: String, // Store time as string (e.g., "10:00 AM")
      required: true,
    },
    scheduledDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "sent", "failed", "calling", "completed"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const ScheduledMessage = mongoose.model(
  "ScheduledMessage",
  scheduledMessageSchema
);
export default ScheduledMessage;
