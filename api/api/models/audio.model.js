// backend/models/audio.model.js
import mongoose from "mongoose";

const audioHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    originalText: {
      type: String,
      required: true,
    },
    audioFileUrl: {
      type: String,
      required: true,
    },
    voiceSettings: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }
);

const AudioHistory = mongoose.model("AudioHistory", audioHistorySchema);
export default AudioHistory;
