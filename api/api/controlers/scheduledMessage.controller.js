import ScheduledMessage from "../models/scheduledMessage.model.js";
import { errorHandler } from "../utils/error.js";
import cron from "node-cron";
import dotenv from 'dotenv'; // Import dotenv
dotenv.config(); // Load environment variables


let client;

(async () => {
  const twilio = await import("twilio");
  client = twilio.default(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
  );
})();

export const createScheduledMessage = async (req, res, next) => {
  const {
    audioHistoryId,
    whatsappNumber,
    scheduledTime,
    scheduledDate,
    callNumber,
  } = req.body;

  if (!audioHistoryId || !whatsappNumber || !scheduledTime || !scheduledDate) {
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    const newScheduledMessage = new ScheduledMessage({
      userId: req.user.id,
      audioHistoryId,
      whatsappNumber,
      scheduledTime,
      scheduledDate,
      callNumber,
    });
    await newScheduledMessage.save();

    scheduleWhatsAppMessage(newScheduledMessage, req.user); // Schedule the message

    res.status(201).json({
      message: "Scheduled message created successfully",
      scheduledMessage: newScheduledMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getScheduledMessages = async (req, res, next) => {
  try {
    const scheduledMessages = await ScheduledMessage.find({
      userId: req.user.id,
    }).populate("audioHistoryId");
    res.status(200).json(scheduledMessages);
  } catch (error) {
    next(error);
  }
};

export const updateScheduledMessage = async (req, res, next) => {
  const {
    audioHistoryId,
    whatsappNumber,
    scheduledTime,
    scheduledDate,
    callNumber,
  } = req.body;
  try {
    const updatedMessage = await ScheduledMessage.findByIdAndUpdate(
      req.params.messageId,
      {
        audioHistoryId,
        whatsappNumber,
        scheduledTime,
        scheduledDate,
        callNumber,
      },
      { new: true }
    );
    res.status(200).json(updatedMessage);
  } catch (error) {
    next(error);
  }
};

export const deleteScheduledMessage = async (req, res, next) => {
  try {
    await ScheduledMessage.findByIdAndDelete(req.params.messageId);
    res.status(200).json("Scheduled message deleted successfully");
  } catch (error) {
    next(error);
  }
};

const scheduleWhatsAppMessage = (scheduledMessage, user) => {
  const { scheduledDate, scheduledTime, audioHistoryId, callNumber } =
    scheduledMessage;
  const [hours, minutes] = scheduledTime.split(":");
  const scheduled = new Date(scheduledDate);
  scheduled.setHours(parseInt(hours));
  scheduled.setMinutes(parseInt(minutes));

  const cronDate = `${minutes} ${hours} ${scheduled.getDate()} ${
    scheduled.getMonth() + 1
  } *`;
  console.log(cronDate);
  // Schedule the cron job
  const job = cron.schedule(cronDate, async () => {
    try {
      // Update status to processing
      await ScheduledMessage.findByIdAndUpdate(
        scheduledMessage._id,
        { status: "calling" },
        { new: true }
      );

      // 1. Fetch audio
      console.log("audioHistoryId:", audioHistoryId);
      const audio = await fetch(
        `http://localhost:3000/api/audio/history/${audioHistoryId}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      console.log("audio response:", audio);
      if (!audio.ok) {
        console.error("Failed to fetch audio:", audio.status, audio.statusText);
        await ScheduledMessage.findByIdAndUpdate(
          scheduledMessage._id,
          { status: "failed" },
          { new: true }
        );
        job.stop();
        return;
      }
      const audioData = await audio.json();
      console.log("audioData: ", audioData);
      // 2. Call user
      if (callNumber)
        await makePhoneCall(
          callNumber,
          audioData?.audioFileUrl,
          scheduledMessage._id
        );
      // 3. Update the status to sent or completed
      await ScheduledMessage.findByIdAndUpdate(
        scheduledMessage._id,
        { status: "completed" },
        { new: true }
      );

      job.stop();
    } catch (error) {
      console.error("Error during scheduled process:", error);
      await ScheduledMessage.findByIdAndUpdate(
        scheduledMessage._id,
        { status: "failed" },
        { new: true }
      );
      job.stop();
    }
  });
};
const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  console.log(fromNumber);
  
const makePhoneCall = async (callNumber, audioUrl, scheduledMessageId) => {
  console.log(`Making a phone call to ${callNumber} with audio: ${audioUrl}`);
  try {
    const call = await client.calls.create({
      to: callNumber,
      from:fromNumber,
      url: audioUrl,
    });
    console.log(`Call SID: ${call.sid}`);
    await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "calling" },
      { new: true }
    );
  } catch (error) {
    console.error("Error making phone call:", error);
    await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "failed" },
      { new: true }
    );
  }
};
