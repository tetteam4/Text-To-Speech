import ScheduledMessage from "../models/scheduledMessage.model.js";
import { errorHandler } from "../utils/error.js";
import cron from "node-cron";

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

    scheduleWhatsAppMessage(newScheduledMessage); // Schedule the message

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

const scheduleWhatsAppMessage = (scheduledMessage) => {
  const {
    scheduledDate,
    scheduledTime,
    audioHistoryId,
    whatsappNumber,
    callNumber,
  } = scheduledMessage;
  const [hours, minutes] = scheduledTime.split(":");
  const scheduled = new Date(scheduledDate);
  scheduled.setHours(parseInt(hours));
  scheduled.setMinutes(parseInt(minutes));

  // Schedule the cron job
  const job = cron.schedule(scheduled, async () => {
    try {
      // Update status to processing
      await ScheduledMessage.findByIdAndUpdate(
        scheduledMessage._id,
        { status: "calling" },
        { new: true }
      );

      // 1. Fetch audio
      const audio = await fetch(`/api/audio/history/${audioHistoryId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const audioData = await audio.json();
      console.log(audioData);
      // 2. Send WhatsApp message and call user
      await sendWhatsAppMessage(
        whatsappNumber,
        audioData.audioFileUrl,
        scheduledMessage._id
      );
      if (callNumber)
        await makePhoneCall(
          callNumber,
          audioData.audioFileUrl,
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

const sendWhatsAppMessage = async (
  whatsappNumber,
  audioUrl,
  scheduledMessageId
) => {
  console.log(
    `Sending WhatsApp message to ${whatsappNumber} with audio: ${audioUrl}`
  );
  // Implement the integration with a WhatsApp Business API.
  // (Twilio, etc.)
  // This is a placeholder. Replace this code with an actual API call.
  try {
    // For instance, you would use a Twilio method call here.
    // You must install the twilio package using `npm i twilio`
    // Here's just a placeholder. You'll need to configure the Twilio client
    /*
         const accountSid = "ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
        const authToken = "your_auth_token";
         const client = require('twilio')(accountSid,authToken);
        const message= await client.messages.create({
             from:"whatsapp:+1xxxxxxxx",
             to:`whatsapp:${whatsappNumber}`,
             body:"New audio message",
             mediaUrl:[audioUrl]
        })
       console.log("whatsapp message sent", message.sid)
         await ScheduledMessage.findByIdAndUpdate(scheduledMessageId, { status: 'sent' }, { new: true });
         */
    await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "sent" },
      { new: true }
    );
  } catch (error) {
    console.error("Error in WhatsApp Sending:", error);
    await ScheduledMessage.findByIdAndUpdate(
      scheduledMessageId,
      { status: "failed" },
      { new: true }
    );
  }
};
const makePhoneCall = async (callNumber, audioUrl, scheduledMessageId) => {
  console.log(`Making a phone call to ${callNumber} with audio: ${audioUrl}`);
  // Implement the integration with a Voice Calling API
  //(Twilio, etc.)
  // This is a placeholder. Replace this code with an actual API call.
  try {
    // For instance, you would use a Twilio method call here.
    // You must install the twilio package using `npm i twilio`
    // Here's just a placeholder. You'll need to configure the Twilio client
    
        const accountSid = process.env.TWILIO_ACCOUNT_SI;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const formNumber = process.env.TWILIO_PHONE_NUMBER;
        const client = require('twilio')(accountSid,authToken);
        const call = await client.calls.create({
            to:callNumber,
            from:formNumber,
            url:audioUrl,

        });
        console.log(`Call SID: ${call.sid}`);
        await ScheduledMessage.findByIdAndUpdate(scheduledMessageId, { status: 'calling' }, { new: true });

        
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
