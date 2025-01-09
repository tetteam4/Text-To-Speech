// server/controllers/speechController.js
import asyncHandler from "express-async-handler";
import { TextToSpeechClient } from "@google-cloud/text-to-speech";
import { Storage } from "@google-cloud/storage";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
dotenv.config();

const getGoogleVoices = asyncHandler(async (req, res) => {
  const client = new TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const [result] = await client.listVoices();
  const voices = result.voices;
  res.json(voices);
});

const generateGoogleSpeech = asyncHandler(async (req, res) => {
  const { text, voiceSettings } = req.body;

  const client = new TextToSpeechClient({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });
  const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const request = {
    input: { text: text },
    voice: {
      languageCode: voiceSettings.languageCode,
      name: voiceSettings.name,
    },
    audioConfig: { audioEncoding: "MP3" },
  };
  const [response] = await client.synthesizeSpeech(request);

  const bucketName = process.env.GCS_BUCKET_NAME;
  const fileName = `audio-${uuidv4()}.mp3`;

  const bucket = storage.bucket(bucketName);
  const file = bucket.file(fileName);

  const stream = file.createWriteStream({
    metadata: { contentType: "audio/mpeg" },
  });

  stream.on("error", (err) => {
    console.error("Error uploading to GCS:", err);
    throw new Error("Error uploading to GCS");
  });

  stream.on("finish", () => {
    const audioFileUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
    res.status(200).json({ audioFileUrl });
  });
  stream.end(response.audioContent);
});

const getDownloadURL = asyncHandler(async (req, res) => {
  const { filename } = req.params;

  const storage = new Storage({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
  });

  const bucket = storage.bucket(process.env.GCS_BUCKET_NAME);
  const file = bucket.file(filename);

  const [url] = await file.getSignedUrl({
    action: "read",
    expires: Date.now() + 1000 * 60 * 60, // URL expires in 1 hour
  });

  res.status(200).json({ url });
});

export { getGoogleVoices, generateGoogleSpeech, getDownloadURL };
