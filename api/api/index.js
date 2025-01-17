import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
// import speechRoutes from "./routes/speech.js";
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
    origin: "http://localhost:5173", // Allow your frontend's origin
    credentials: true, // Allow cookies and headers to be sent
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow specific methods (you might need more later)
    allowedHeaders: ["Content-Type", "Authorization", "X-USER-ID"],
  })
);

//we extract cookie form browser
app.use(cookieParser());
// app.use(session({

app.listen(3000, () => {
  console.log("Server is listen to port 3000!");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
// app.use("/api/speech", speechRoutes);

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

// // ////// Aseeemmmbly
// import express from "express";
// import mongoose from "mongoose";
// import dotenv from "dotenv";
// import userRoutes from "./routes/user.route.js";
// import authRoutes from "./routes/auth.route.js";
// import cookieParser from "cookie-parser";
// import path from "path";
// import { AssemblyAI } from "assemblyai";
// import multer from "multer";
// import cors from "cors";

// dotenv.config();

// mongoose
//   .connect(process.env.MOGNOURL)
//   .then(() => {
//     console.log("mongodb is connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

// const __dirname = path.resolve();
// const app = express();
// app.use(express.json());
// app.use(cookieParser());

// // Enable CORS
// app.use(
//   cors({
//     origin: "http://localhost:5173",
//     credentials: true,
//   })
// );

// const upload = multer({ storage: multer.memoryStorage() });

// app.listen(3000, () => {
//   console.log("Server is listen to port 3000!");
// });

// app.use("/api/user", userRoutes);
// app.use("/api/auth", authRoutes);

// const aai = new AssemblyAI({
//   apiKey: "b1d98b64c7be4f86be833d4e88f8b791",
// });

// const tts = aai.textToSpeech;

// // New route to get the list of AssemblyAI voices
// app.get("/api/speech/assemblyai-voices", async (req, res) => {
//   try {
//     console.log("aai object:", aai);
//     console.log("tts object:", tts);

//     const response = await tts.listVoices();
//     const voices = response.voices.map((voice) => ({
//       name: voice.name,
//       id: voice.id,
//       languageCode: voice.language_code,
//       gender: voice.gender,
//     }));
//     res.status(200).json(voices);
//   } catch (error) {
//     console.error("Error fetching voices from AssemblyAI:", error);
//     console.error("AssemblyAI error:", error.message || error);
//     res.status(500).json({ message: "Error fetching voices" });
//   }
// });

// // New route to handle the AssemblyAI text-to-speech (without Google Cloud Storage)
// app.post("/api/speech/generate-assemblyai", upload.none(), async (req, res) => {
//   try {
//     const { text, voiceSettings } = req.body;
//     if (!text) {
//       return res.status(400).json({ message: "Text is empty" });
//     }
//     if (!voiceSettings) {
//       return res.status(400).json({ message: "Voice settings is missing" });
//     }

//     const response = await tts.transcribe({
//       text: text,
//       voice_id: voiceSettings.id,
//       // Other parameters can be added
//     });

//     if (response && response.audio_url) {
//       res.status(200).json({ audioFileUrl: response.audio_url }); // Return AssemblyAI audio URL directly
//     } else {
//       console.log("Error from AssemblyAI", response);
//       res
//         .status(500)
//         .json({ message: "Error generating speech from AssemblyAI" });
//     }
//   } catch (error) {
//     console.error("Error generating speech:", error);
//     res.status(500).json({ message: "Error generating speech" });
//   }
// });

// // ////dir
// // app.use(express.static(path.join(__dirname, '/client/')));
// app.use(express.static(path.join(__dirname, "/client/dist")));

// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "client", "dist", "index.html"));
// });

// // this medllware handle sigin error
// app.use((err, req, res, next) => {
//   const statusCode = err.statusCode || 500;
//   const message = err.message || "internal server Error";
//   res.status(statusCode).json({
//     success: false,
//     statusCode,
//     message,
//   });
// });
