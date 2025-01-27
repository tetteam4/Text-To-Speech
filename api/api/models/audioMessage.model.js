import mongoose from "mongoose";

const audioMessageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    audioHistoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "AudioHistory",
    },
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["sent", "delivered", "read"],
      default: "sent",
    },
    isSeen: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AudioMessage = mongoose.model("AudioMessage", audioMessageSchema);
export default AudioMessage;
