// backend/models/audioMessage.model.js
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
      required: true,
    },
    message: {
      type: String,
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
