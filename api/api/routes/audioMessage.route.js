// backend/routes/audioMessage.route.js
import express from "express";
import {
  createAudioMessage,
  getAudioMessages,
  markMessageAsRead,
} from "../controlers/audioMessage.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/create", verifyToken, createAudioMessage);
router.get("/getmessages", verifyToken, getAudioMessages);
router.put("/mark-read/:messageId", verifyToken, markMessageAsRead);

export default router;
