import express from "express";
import {
  test,
  deleteUser,
  signout,
  updateUsers,
  geteUsers,
} from "../controlers/user.controllers.js";
import { verifyToken } from "../utils/verifyUser.js";
// import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();
// router.get("/online", verifyToken, getOnlineUsers);
router.put("/update/:id", updateUsers, verifyToken);
router.delete("/delete/:userId", verifyToken, deleteUser);
router.post("/signout", signout);
router.get("/getusers", verifyToken, geteUsers);

export default router;
