// backend/controlers/audioMessage.controller.js
import AudioMessage from "../models/audioMessage.model.js";
import AudioHistory from "../models/audio.model.js";
import { errorHandler } from "../utils/error.js";

export const createAudioMessage = async (req, res, next) => {
  const { receiverId, audioHistoryId, message } = req.body;

  if (!receiverId || !audioHistoryId) {
    return next(errorHandler(400, "All fields are required "));
  }

  try {
    const audioHistory = await AudioHistory.findById(audioHistoryId);

    if (!audioHistory) return next(errorHandler(404, "Not found Audio"));
    const newAudioMessage = new AudioMessage({
      senderId: req.user.id,
      receiverId,
      audioHistoryId: audioHistoryId,
      message,
    });
    await newAudioMessage.save();
    res.status(201).json({ message: "Audio message sent successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAudioMessages = async (req, res, next) => {
  try {
    const audioMessages = await AudioMessage.find({
      $or: [{ senderId: req.user.id }, { receiverId: req.user.id }],
    })
      .sort({ createdAt: "asc" })
      .populate("senderId", "username profilePicture")
      .populate("audioHistoryId");
    res.status(200).json(audioMessages);
  } catch (error) {
    next(error);
  }
};

export const markMessageAsRead = async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const message = await AudioMessage.findById(messageId);
    if (!message) return next(errorHandler(404, "message not found"));
    if (message.receiverId.toString() !== req.user.id)
      return next(errorHandler(403, "you are not auth to edit"));

    const updatedMessage = await AudioMessage.findByIdAndUpdate(
      messageId,
      { isSeen: true },
      { new: true }
    );

    res
      .status(200)
      .json({ message: " message read successfully", updatedMessage });
  } catch (error) {
    next(error);
  }
};
