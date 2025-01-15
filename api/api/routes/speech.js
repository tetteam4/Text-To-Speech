import express from "express";
import {
  getSpeechifyVoices,
  generateSpeechifySpeech,
} from "../controlers/speechController.js";

const router = express.Router();

router.get("/speechify-voices", getSpeechifyVoices);
router.post("/generate-speechify", generateSpeechifySpeech);

export default router;
