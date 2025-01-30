import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  shareAudio,
  saveAudioHistory,
  getAudioHistory,
  deleteAudioHistory,
  uploadAudio,
  getAudioHistoryById,
} from "../controlers/audio.controller.js";
import multer from "multer";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = express.Router();

router.post("/save", verifyToken, saveAudioHistory);
router.get("/history", verifyToken, getAudioHistory);
router.post("/share/:audioId", verifyToken, shareAudio);
router.delete("/delete/:audioId", verifyToken, deleteAudioHistory);
router.post("/upload", verifyToken, upload.single("audio"), uploadAudio);
router.get("/history/:audioHistoryId", getAudioHistoryById);

export default router;
