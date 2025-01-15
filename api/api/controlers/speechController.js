import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const getSpeechifyVoices = asyncHandler(async (req, res) => {
  try {
    const apiKey = "CkfHCUC8LectCIwwWAnKSFSyK9Zm4soMrt9tC_GQJms=";
    console.log("fetching voices with API_KEY:", apiKey);

    const response = await axios.get(
      "https://api.sws.speechify.com/v1/tts/voices",
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    console.log("speechify response status:", response.status);
    console.log("speechify response data:", response.data);

    if (response.data && Array.isArray(response.data)) {
      const voices = response.data.map((voice) => ({
        id: voice.id,
        name: voice.name,
        language: voice.language,
        languageCode: voice.language_code,
        gender: voice.gender,
      }));
      res.json(voices);
    } else {
      console.log("No voices found or data is not correctly formatted");
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching Speechify voices:", error);
    console.log(
      "Error response from Speechify:",
      error.response && error.response.data
    );
    res.status(500).json({ message: "Error fetching Speechify voices" });
  }
});

const generateSpeechifySpeech = asyncHandler(async (req, res) => {
  const { text, voiceSettings } = req.body;
  console.log("voiceSettings in generateSpeechifySpeech", voiceSettings); // log for debug
  try {
    const apiKey = process.env.SPEECHIFY_API_KEY;

    const response = await axios.post(
      "https://api.sws.speechify.com/v1/tts/synthesize",
      {
        text: text,
        voice_id: voiceSettings.id, // Use voice_id here
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data && response.data.audio_url) {
      res.status(200).json({ audioFileUrl: response.data.audio_url });
    } else {
      res
        .status(500)
        .json({ message: "Error generating speech from Speechify" });
    }
  } catch (error) {
    console.log("Error during generate speech", error);
    res.status(500).json({ message: "Error generating speech" });
  }
});

export { getSpeechifyVoices, generateSpeechifySpeech };
