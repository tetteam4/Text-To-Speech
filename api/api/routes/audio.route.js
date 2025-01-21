// backend/routes/audio.route.js
import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  shareAudio,
  saveAudioHistory,
  getAudioHistory,
} from "../controlers/audio.controller.js";

const router = express.Router();

router.post("/save", verifyToken, saveAudioHistory);
router.get("/history", verifyToken, getAudioHistory);
router.post("/share/:audioId", verifyToken, shareAudio);

export default router;
