//  twiML controller (twiML.controller.js)

import twilio from "twilio";

const voiceResponse = (audioUrl) => {
  const twiml = new twilio.twiml.VoiceResponse();
  twiml.play(audioUrl);
  return twiml.toString();
};

export const getTwiML = async (req, res, next) => {
  try {
    const { audioUrl } = req.query;
    if (!audioUrl) {
      return res.status(400).send("audioUrl is missing in the request");
    }

    const twimlResponse = voiceResponse(audioUrl);
    res.set("Content-Type", "text/xml");
    res.status(200).send(twimlResponse);
  } catch (error) {
    next(error);
  }
};
