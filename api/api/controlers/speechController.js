// server/controllers/speechController.js
import asyncHandler from "express-async-handler";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();


const getPlayHtVoices = asyncHandler(async (req, res) => {
  try {
    const userId = "U18QgE6BMrZTPQfR15UzeujYk9G2";
    const apiKey = "90db0bfc6bd9459dbed9959d71793a33";
    console.log("fetching voices with USER_ID:", userId, "KEY:", apiKey); // added log here
    const response = await axios.get("https://play.ht/api/v2/voices", {
      headers: {
        AUTHORIZATION: apiKey,
        "X-USER-ID": userId,
      },
    });

    console.log("Play.ht API Response:", response.data); // added log here
    if (response.data && response.data.voices) {
      const voices = response.data.voices.map((voice) => ({
        id: voice.id,
        name: voice.name,
        languageCode: voice.language,
        gender: voice.gender,
      }));
      res.json(voices);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Error fetching Play.ht voices:", error);
    res.status(500).json({ message: "Error fetching Play.ht voices" });
  }
});


const generatePlayHtSpeech = asyncHandler(async (req, res) => {
  const { text, voiceSettings } = req.body;

  try {
    const userId = "U18QgE6BMrZTPQfR15UzeujYk9G2";
    const apiKey = "90db0bfc6bd9459dbed9959d71793a33";
    const response = await axios.post(
      "https://play.ht/api/v2/tts",
      {
        text: text,
        voice: voiceSettings.id,
        output_format: "mp3",
      },
      {
        headers: {
          AUTHORIZATION: apiKey,
          "X-USER-ID": userId,
        },
      }
    );
    if (response.data && response.data.audio_url) {
      res.status(200).json({ audioFileUrl: response.data.audio_url });
    } else {
      console.log("Error from Play.ht", response);
      res.status(500).json({ message: "Error generating speech from Play.ht" });
    }
  } catch (error) {
    console.error("Error generating Play.ht speech:", error);
    res.status(500).json({ message: "Error generating speech" });
  }
});

export { getPlayHtVoices, generatePlayHtSpeech };
