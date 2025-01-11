import express from "express";
import { google, signup, singin } from "../controlers/auth.controller.js";

const router = express.Router();

router.post("/signup", signup);
// router.post("/signin",singin)
router.post("/signin", singin);

router.post("/google", google);
// router.post("/memberSignup",memberSignUp)
// // router.post("/memberSignin",membersignin)
// router.post("/memberSignin",membersignin)

export default router;
