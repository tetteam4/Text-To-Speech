// routes/audio.route.js
import express from "express";
import {
  convertFileToSpeech,
  getAudioHistory,
  shareAudioFile,
  getAudioFile,
} from "../controlers/audio.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/convert", verifyToken, convertFileToSpeech);
router.get("/history", verifyToken, getAudioHistory);
router.post("/share/:audioId", verifyToken, shareAudioFile);
router.get("/:audioId", verifyToken, getAudioFile);

export default router;
