// tts-app/backend/services/notificationService.js
const Notification = require("../models/Notification");
const AudioFile = require("../models/AudioFile");

exports.createNotification = async (
  message,
  scheduledAt,
  userId,
  audioFile
) => {
  try {
    const newAudioFile = new AudioFile({
      filename: audioFile.filename,
      path: audioFile.path,
      user: userId,
    });
    await newAudioFile.save();

    const newNotification = new Notification({
      message,
      scheduledAt,
      user: userId,
      audioFile: newAudioFile._id,
    });
    return await newNotification.save();
  } catch (error) {
    throw new Error("Error creating notification");
  }
};

exports.getNotifications = async (userId) => {
  try {
    return await Notification.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("audioFile");
  } catch (error) {
    throw new Error("Error fetching notifications");
  }
};
