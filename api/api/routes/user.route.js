import express from "express";
import {
  test,
  deleteUser,
  signout,
  updateUsers,
  geteUsers,
  getOnlineUsers, // Ensure this is imported
  lastSeen,
} from "../controlers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
router.put("/update/:id", verifyToken, updateUsers);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, geteUsers);
router.get("/online", verifyToken, getOnlineUsers); // Add this
router.get("/lastSeen/:userId", verifyToken, lastSeen); // Add this

export default router;
