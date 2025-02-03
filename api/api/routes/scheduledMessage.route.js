import express from "express";
import {
  createScheduledMessage,
  getScheduledMessages,
  updateScheduledMessage,
  deleteScheduledMessage,
} from "../controlers/scheduledMessage.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
// import { getTwiML } from "../controlers/twiML.controller.js";

const router = express.Router();

router.post("/create", verifyToken, createScheduledMessage);
router.get("/get", verifyToken, getScheduledMessages);
router.put("/update/:messageId", verifyToken, updateScheduledMessage);
router.delete("/delete/:messageId", verifyToken, deleteScheduledMessage);

export default router;
