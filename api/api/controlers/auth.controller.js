

import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import sendEmail from "../utils/email.js";
const mySecretKety = "hussain";

export const signup = async (req, res, next) => {
  const { username, password, email } = req.body;
  if (
    !username ||
    !password ||
    !email ||
    username === "" ||
    password === "" ||
    email === ""
  ) {
    next(errorHandler(400, "همه فیلدها الزامی است"));
  }
  // 10 is roound maxer
  const hashedPassword = bcrypt.hashSync(password, 12);
  const newUser = new User({
    username: username,
    email: email,
    password: hashedPassword,
  });

  try {
    // Generate verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");
    newUser.verificationToken = verificationToken;
    newUser.verificationTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour

    await newUser.save();

    // Send verification email
    const verificationUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`; // Replace with your actual URL
    const emailHtml = `
    <p>Please click the following link to verify your email address:</p>
    <a href="${verificationUrl}">Verify Email</a>
  `;

    await sendEmail({
      email: newUser.email,
      subject: "Verfiy Your Email",
      html: emailHtml,
    });
    res.json({
      message: "Sign up successful ,please check your email and verify",
    });
  } catch (error) {
    next(error);
  }
};

/////////////////////////signIn route API
// why we use the asybnc method
export const singin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    next(errorHandler(400, "All fields are required"));
  }
  // check email and password
  try {
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User Not Found"));
    }
    // Check if the user is verified
    if (!validUser.isVerified) {
      return next(
        errorHandler(403, "Please verify your email before logging in.")
      );
    }
    //plainText , hashed password
    const validPassword = bcrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(404, "Passwords do not match"));
    }

    // ues token for auth users
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser },
      mySecretKety,
      { expiresIn: "5d" }
    );
    const { password: pass, ...rest } = validUser._doc;
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

/// google auth route handler controlers

export const google = async (req, res, next) => {
  const { email, name, googlePhotoUrl } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // Check if the user is verified
      if (!user.isVerified) {
        return next(
          errorHandler(403, "Please verify your email before logging in.")
        );
      }
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        mySecretKety,
        { expiresIn: "5d" }
      );
      const { password, ...rest } = user._doc;

      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          // secure: true,
          // sameSite: 'none',
        })
        .json(rest);
    } else {
      /// if is not exist
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);
      const hashedPassword = bcrypt.hashSync(generatedPassword, 10);
      const newUser = new User({
        username:
          name.toLowerCase().split(" ").join("") +
          Math.random().toString(9).slice(-4),
        email,
        password: hashedPassword,
        profilePicture: googlePhotoUrl,
      });

      // Generate verification token
      const verificationToken = crypto.randomBytes(20).toString("hex");
      newUser.verificationToken = verificationToken;
      newUser.verificationTokenExpiry = Date.now() + 3600000; // Token expires in 1 hour
      await newUser.save();

      // Send verification email
      const verificationUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`; // Replace with your actual URL
      const emailHtml = `
        <p>Please click the following link to verify your email address:</p>
        <a href="${verificationUrl}">Verify Email</a>
      `;
      await sendEmail({
        email: newUser.email,
        subject: "Verfiy Your Email",
        html: emailHtml,
      });

      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        mySecretKety,
        { expiresIn: "5d" }
      );
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          // sameSite: 'none',
          // secure: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};