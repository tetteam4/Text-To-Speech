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
import { Server } from "socket.io";
import { createServer } from "http";

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
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-USER-ID"],
  },
});
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization", "X-USER-ID"],
  })
);

app.use(cookieParser());

httpServer.listen(3000, () => {
  console.log("Server is listening on port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/audio", audioRoutes);
app.use("/api/audioMessage", audioMessageRoutes);

app.use(express.static(path.join(__dirname, "/client/dist")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

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
const userSocketMap = new Map();
io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  socket.on("setUserId", (userId) => {
    userSocketMap.set(userId, socket.id);
    console.log("a user connected", socket.id, userId);
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    for (const [userId, socketId] of userSocketMap.entries()) {
      if (socketId === socket.id) {
        userSocketMap.delete(userId);
        break;
      }
    }
    console.log("user disconnected", socket.id);
  });

  socket.on("send_message", (message) => {
    console.log(message);
    io.emit("receive_message", message);
  });
});
export { io, userSocketMap };
