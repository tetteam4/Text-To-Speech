import express from "express";
import { google, signup, singin } from "../controlers/auth.controller.js";
import { verifyEmail } from "../controlers/verification.controller.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", singin);
router.post("/google", google);
router.get("/verify/:token", verifyEmail);

export default router;
