// server/routes/auth.js
import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  updateUserProfile,
} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", authUser);
router.post("/logout", protect, logoutUser);
router.put("/profile", protect, updateUserProfile);

export default router;
