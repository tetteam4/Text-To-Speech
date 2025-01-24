import AudioHistory from "../models/audio.model.js";
import { errorHandler } from "../utils/error.js";

export const saveAudioHistory = async (req, res, next) => {
  const { text, audioUrl, voiceSettings } = req.body;
  if (!text || !audioUrl) {
    return next(errorHandler(400, "All filed are required "));
  }
  try {
    const newHistory = new AudioHistory({
      userId: req.user.id,
      originalText: text,
      audioFileUrl: audioUrl,
      voiceSettings: voiceSettings,
    });
    await newHistory.save();
    res.status(201).json({ message: "Audio history saved successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAudioHistory = async (req, res, next) => {
  try {
    const history = await AudioHistory.find({ userId: req.user.id }).sort({
      createdAt: "desc",
    });
    const data = history.map((item) => ({
      ...item.toObject(),
      id: item._id,
    }));
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

export const shareAudio = async (req, res, next) => {
  const { userId } = req.body;
  try {
    const audio = await AudioHistory.findById(req.params.audioId);
    if (!audio) {
      return next(errorHandler(404, "audio not found"));
    }
    if (userId) {
      await AudioHistory.findByIdAndUpdate(
        req.params.audioId,
        { $push: { sharedWith: userId } },
        { new: true }
      );
      res.status(200).json({ message: "audio is shared with succesfuly" });
    } else {
      return next(errorHandler(401, "not exist"));
    }
  } catch (error) {
    next(error);
  }
};

export const deleteAudioHistory = async (req, res, next) => {
  try {
    const audioId = req.params.audioId;
    const audio = await AudioHistory.findById(audioId);
    if (!audio) {
      return next(errorHandler(404, "audio not found"));
    }
    if (audio.userId.toString() !== req.user.id) {
      return next(errorHandler(403, "Unauthorized to delete this record"));
    }
    await AudioHistory.findByIdAndDelete(audioId);
    res.status(200).json({ message: "Audio deleted succesfully" });
  } catch (error) {
    next(error);
  }
};
