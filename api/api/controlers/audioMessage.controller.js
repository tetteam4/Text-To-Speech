import AudioMessage from "../models/audioMessage.model.js";
import AudioHistory from "../models/audio.model.js";
import { errorHandler } from "../utils/error.js";
import { io, userSocketMap } from "../index.js"; // Import io object

export const createAudioMessage = async (req, res, next) => {
  const { receiverId, audioHistoryId, message } = req.body;

  if (!receiverId) {
    return next(errorHandler(400, "All fields are required "));
  }

  try {
    if (!audioHistoryId && !message) {
      return next(
        errorHandler(400, "Please select a audio or type a message to send")
      );
    }
    const audioHistory = audioHistoryId
      ? await AudioHistory.findById(audioHistoryId)
      : null;

    if (audioHistoryId && !audioHistory)
      return next(errorHandler(404, "Not found Audio"));

    const newAudioMessage = new AudioMessage({
      senderId: req.user.id,
      receiverId,
      audioHistoryId: audioHistoryId ? audioHistoryId : null,
      message,
    });
    await newAudioMessage.save();

    const messageWithSender = await AudioMessage.findById(newAudioMessage._id)
      .populate("senderId", "username profilePicture")
      .populate("audioHistoryId");
    const receiverSocketId = userSocketMap.get(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("new_notification", {
        senderId: req.user.id,
      });
    }
    res.status(201).json(messageWithSender);
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

export const deliveredMessage = async (req, res, next) => {
  const { messageId } = req.params;
  try {
    const message = await AudioMessage.findById(messageId);
    if (!message) return next(errorHandler(404, "message not found"));
    if (message.receiverId.toString() !== req.user.id)
      return next(errorHandler(403, "you are not auth to edit"));

    const updatedMessage = await AudioMessage.findByIdAndUpdate(
      messageId,
      { status: "delivered" },
      { new: true }
    );

    io.emit("message_delivered", updatedMessage); // Emit message delivered update
    res
      .status(200)
      .json({ message: " message delivered successfully", updatedMessage });
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
      { status: "read", isSeen: true },
      { new: true }
    );
    const senderSocketId = userSocketMap.get(updatedMessage.senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("read_notification", updatedMessage);
    }

    res
      .status(200)
      .json({ message: " message read successfully", updatedMessage });
  } catch (error) {
    next(error);
  }
};
