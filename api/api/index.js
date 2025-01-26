import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import audioRoutes from "./routes/audio.route.js";
import audioMessageRoutes from "./routes/audioMessage.route.js";
import cookieParser from "cookie-parser";

import path from "path";
import cors from "cors";

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
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, // Allow cookies and headers to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods (you might need more later)
    allowedHeaders: ["Content-Type", "Authorization", "X-USER-ID"],
  })
);

app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is listen to port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/audio", audioRoutes);
 app.use("/api/audioMessage", audioMessageRoutes);

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
