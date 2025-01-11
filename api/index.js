import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";
import path from "path";

// import  CommentRoute  from "./controlers/comment.controller.js";
// import multer from "multer";
// import path from "path"; // Import path module

dotenv.config();

mongoose
  .connect(process.env.MOGNOURL)

  .then(() => {
    console.log("mongodb is connected");
  })
  .catch((err) => {
    console.log(err);
  });

const __dirname = path.resolve();
const app = express();
app.use(express.json());

//we extract cookie form browser
app.use(cookieParser());
// app.use(session({

app.listen(3000, () => {
  console.log("Server is listen to port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

// ////dir
// app.use(express.static(path.join(__dirname, '/client/')));
app.use(express.static(path.join(__dirname, "/client/dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
});

// this medllware handle sigin error
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "internal server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
