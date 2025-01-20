// // controlers/audio.controller.js
// import AudioFile from "../models/audiofile.model.js";
// import { errorHandler } from "../utils/error.js";
// import multer from "multer";
// import { v4 as uuidv4 } from "uuid";
// import fs from "fs";
// import axios from "axios";
// const edenApiKey =
//   "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjkwYjUxMTctZWU0ZS00ZjI5LWJkMGQtMmRjYmYwN2FlYmRmIiwidHlwZSI6ImFwaV90b2tlbiJ9.mxfwBW74jVtbu0Lw21R8kPs520EVyGozqfQAruJHg2g";

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/");
//   },
//   filename: function (req, file, cb) {
//     const uniqueFilename = `${uuidv4()}-${file.originalname}`;
//     cb(null, uniqueFilename);
//   },
// });

// const upload = multer({ storage: storage });

// export const convertFileToSpeech = async (req, res, next) => {
//   upload.single("file")(req, res, async (err) => {
//     if (err) {
//       return next(errorHandler(400, "Error uploading file"));
//     }
//     const { voiceSettings, text } = req.body;
//     let originalText = null;
//     if (req.file?.mimetype === "text/plain") {
//       originalText = fs.readFileSync(req.file.path, "utf-8");
//     }
//     const audioData = await generateAudio(
//       text || originalText,
//       JSON.parse(voiceSettings)
//     );
//     if (!audioData) {
//       return next(errorHandler(500, "Error generating audio"));
//     }
//     try {
//       const newAudioFile = new AudioFile({
//         userId: req.user.id,
//         originalText: text || originalText,
//         audioFileUrl: audioData,
//         voiceSettings: JSON.parse(voiceSettings),
//       });
//       await newAudioFile.save();
//       res.status(201).json({
//         message: "File converted and stored successfully",
//         audioFileUrl: audioData,
//       });
//     } catch (error) {
//       console.log(error);
//       next(error);
//     } finally {
//       if (req.file) {
//         fs.unlinkSync(req.file.path);
//       }
//     }
//   });
// };

// const generateAudio = async (text, voiceSettings) => {
//   try {
//     const response = await axios.post(
//       "https://api.edenai.run/v2/audio/text_to_speech",
//       {
//         providers: "amazon,google,ibm,microsoft",
//         language: voiceSettings.languageCode,
//         text: text,
//         option: voiceSettings.name.split("-").pop(),
//         audio_rate: voiceSettings.rate,
//         audio_pitch: voiceSettings.pitch,
//         audio_volume: voiceSettings.volume,
//         audio_format: voiceSettings.format,
//       },
//       {
//         headers: {
//           authorization: `Bearer ${edenApiKey}`,
//         },
//       }
//     );
//     if (
//       response.data &&
//       response.data.amazon &&
//       response.data.amazon.audio_resource_url
//     ) {
//       return response.data.amazon.audio_resource_url;
//     } else if (
//       response.data &&
//       response.data.google &&
//       response.data.google.audio_resource_url
//     ) {
//       return response.data.google.audio_resource_url;
//     } else if (
//       response.data &&
//       response.data.ibm &&
//       response.data.ibm.audio_resource_url
//     ) {
//       return response.data.ibm.audio_resource_url;
//     } else if (
//       response.data &&
//       response.data.microsoft &&
//       response.data.microsoft.audio_resource_url
//     ) {
//       return response.data.microsoft.audio_resource_url;
//     } else {
//       throw new Error("Invalid audio URL received from the API");
//     }
//   } catch (error) {
//     console.error("Error generating speech:", error);
//     throw new Error(error);
//   }
// };

// export const getAudioHistory = async (req, res, next) => {
//   try {
//     const history = await AudioFile.find({ userId: req.user.id }).sort({
//       createdAt: -1,
//     });
//     res.status(200).json(history);
//   } catch (error) {
//     next(error);
//   }
// };

// export const shareAudioFile = async (req, res, next) => {
//   const { audioId } = req.params;
//   const { userId } = req.body;
//   try {
//     const audioFile = await AudioFile.findById(audioId);
//     if (!audioFile) {
//       return next(errorHandler(404, "Audio file not found"));
//     }
//     if (audioFile.userId.toString() !== req.user.id) {
//       return next(errorHandler(403, "You are not allowed to share this audio"));
//     }
//     audioFile.sharedWith.push(userId);
//     await audioFile.save();
//     res.status(200).json({ message: "Audio file shared successfully" });
//   } catch (error) {
//     next(error);
//   }
// };
// export const getAudioFile = async (req, res, next) => {
//   const { audioId } = req.params;
//   try {
//     const audioFile = await AudioFile.findById(audioId);
//     if (!audioFile) {
//       return next(errorHandler(404, "Audio file not found"));
//     }
//     if (
//       audioFile.userId.toString() !== req.user.id &&
//       !audioFile.sharedWith.includes(req.user.id) &&
//       !audioFile.isPublic
//     ) {
//       return next(errorHandler(403, "You are not allowed to access this file"));
//     }
//     res.status(200).json(audioFile);
//   } catch (error) {
//     next(error);
//   }
// };
