// models/audiofile.model.js
import mongoose from "mongoose";

const audioFileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    originalText: {
      type: String,
      required: false,
    },
    audioFileUrl: {
      type: String,
      required: true,
    },
    voiceSettings: {
      type: Object,
      required: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    sharedWith: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "User",
      default: [],
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const AudioFile = mongoose.model("AudioFile", audioFileSchema);

export default AudioFile;
