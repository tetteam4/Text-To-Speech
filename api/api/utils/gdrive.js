// import { google } from "googleapis";
// import { Storage } from "@google-cloud/storage";
// import { Readable } from "stream";
// import dotenv from "dotenv";
// dotenv.config();

// const storage = new Storage({
//   keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
// });

// const uploadToGoogleDrive = async (buffer, filename) => {
//   const bucket = storage.bucket(process.env.GOOGLE_STORAGE_BUCKET);
//   const file = bucket.file(filename);
//   const stream = new Readable();
//   stream.push(buffer);
//   stream.push(null);
//   await new Promise((resolve, reject) => {
//     stream
//       .pipe(
//         file.createWriteStream({
//           metadata: {
//             contentType: "audio/mpeg",
//           },
//         })
//       )
//       .on("finish", resolve)
//       .on("error", reject);
//   });
//   return file.publicUrl();
// };

// export default uploadToGoogleDrive;
