import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  shareAudio,
  saveAudioHistory,
  getAudioHistory,
  deleteAudioHistory,
} from "../controlers/audio.controller.js";

const router = express.Router();

router.post("/save", verifyToken, saveAudioHistory);
router.get("/history", verifyToken, getAudioHistory);
router.post("/share/:audioId", verifyToken, shareAudio);
router.delete("/delete/:audioId", verifyToken, deleteAudioHistory);

export default router;
