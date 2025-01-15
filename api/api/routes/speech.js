// server/routes/speech.js
import express from "express";
import {
  getPlayHtVoices,
  generatePlayHtSpeech,
} from "../controlers/speechController.js";
// import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.get("/playht-voices", getPlayHtVoices);
router.post("/generate-playht", generatePlayHtSpeech);

export default router;
