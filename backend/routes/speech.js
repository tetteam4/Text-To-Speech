// server/routes/speech.js
import express from "express";
import {
  getGoogleVoices,
  generateGoogleSpeech,
  getDownloadURL,
} from "../controllers/speechController.js";
import { protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.get("/google-voices", protect, getGoogleVoices);
router.post("/generate-google", protect, generateGoogleSpeech);
router.get("/get-download-url/:filename", protect, getDownloadURL);
export default router;
