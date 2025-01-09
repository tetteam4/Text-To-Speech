  // server/index.js
    import express from 'express';
    import dotenv from 'dotenv';
    import cors from 'cors';
    import connectDB from './config/db.js'
    import authRoutes from './routes/auth.js'
    import speechRoutes from './routes/speech.js';
    import projectRoutes from "./routes/projects.js";
    import { notFound, errorHandler } from './middleware/errorMiddleware.js'
    dotenv.config();

   const app = express();
    connectDB();
  app.use(
    cors({
      origin: "http://localhost:5173", // Replace with your frontend's exact origin
      credentials: true, // Allow cookies to be sent back
    })
);
  app.use((req, res, next) => {
    res.setHeader(
      "Content-Security-Policy",
      "script-src 'self' 'wasm-unsafe-eval'" // Add nonce or hash if needed
    );
    next();
  });
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

     app.use('/api/auth',authRoutes);
     app.use('/api/speech', speechRoutes);
     app.use("/api/projects", projectRoutes);  

   app.use(notFound);
   app.use(errorHandler);

  const port = process.env.PORT || 4000;
   app.listen(port, () => {
     console.log(`server is running on port ${port}`);
   });