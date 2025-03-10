import ScheduledMessage from "../models/scheduledMessage.model.js";
import { errorHandler } from "../utils/error.js";
import cron from "node-cron";
import dotenv from "dotenv";
import axios from "axios";
import { fileURLToPath } from "url";
import path from "path";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    scheduleWhatsAppMessage(newScheduledMessage, req.user);

    res.status(201).json({
      message: "Scheduled message created successfully",
      scheduledMessage: newScheduledMessage,
    });
  } catch (error) {
    next(error);
  }
};

export const getScheduledMessages = async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 5;
  const startIndex = (page - 1) * limit;
  try {
    const totalMessages = await ScheduledMessage.countDocuments({
      userId: req.user.id,
    });
    const messages = await ScheduledMessage.find({ userId: req.user.id })
      .populate("audioHistoryId")
      .skip(startIndex)
      .limit(limit);
    res.status(200).json({
      messages,
      totalMessages,
    });
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
const uploadMediaToTwilio = async (audioUrl) => {
  try {
    const response = await axios.get(audioUrl, { responseType: "arraybuffer" });

    if (response.status !== 200) {
      throw new Error(
        `Failed to download audio file with status: ${response.status}`
      );
    }

    const buffer = Buffer.from(response.data, "binary");

    const upload = await client.media.create({
      body: buffer,
      contentType: "audio/mpeg",
    });

    return upload.mediaUrl;
  } catch (error) {
    console.error("Error during upload to twilio:", error);
    throw new Error(`Failed to upload to MessageBird status: ${error.message}`);
  }
};
const scheduleWhatsAppMessage = (scheduledMessage, user) => {
  const {
    scheduledDate,
    scheduledTime,
    audioHistoryId,
    callNumber,
    whatsappNumber,
  } = scheduledMessage;
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
      await makePhoneCall(
        callNumber,
        audioData?.audioFileUrl,
        audioData?.originalText,
        whatsappNumber,
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

const makePhoneCall = async (
  callNumber,
  audioUrl,
  originalText,
  whatsappNumber,
  scheduledMessageId
) => {
  const fromNumber = process.env.TWILIO_PHONE_NUMBER;
  const whatsAppFromNumber = process.env.TWILIO_WHATSAPP_NUMBER;
  if (!fromNumber) {
    console.error("Error : Twilio from number is missing ");
    return await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "failed" },
      { new: true }
    );
  }
  if (!whatsAppFromNumber) {
    console.error("Error : Twilio whatsApp from number is missing ");
    return await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "failed" },
      { new: true }
    );
  }
  console.log(`Making a phone call to ${callNumber} with audio: ${audioUrl}`);
  try {
    const twimlRes = await axios.get(
      `http://localhost:3000/api/twiml?audioUrl=${audioUrl}`
    );

    if (twimlRes.status !== 200) {
      console.error(
        "Error fetching twiML:",
        twimlRes.status,
        twimlRes.statusText
      );
      return await ScheduledMessage.findByIdAndUpdate(
        scheduledMessageId,
        { status: "failed" },
        { new: true }
      );
    }
    const call = await client.calls.create({
      to: callNumber,
      from: fromNumber,
      url: `http://localhost:3000/api/twiml?audioUrl=${audioUrl}`,
    });
    console.log(`Call SID: ${call.sid}`);
    const mediaUrl = await uploadMediaToTwilio(audioUrl);
    const message = await client.messages.create({
      body: originalText,
      from: `whatsapp:${whatsAppFromNumber}`,
      to: `whatsapp:${whatsappNumber}`,
      mediaUrl: [mediaUrl],
    });
    console.log(`WhatsApp message SID: ${message.sid}`);
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
