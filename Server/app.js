import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import testRouter from "./routes/testRouter.js";
import uploadRouter from "./routes/uploadRouter.js";
import progressRouter from "./routes/progressRouter.js";
import authRouter from "./routes/authRouter.js";

import cookieParser from "cookie-parser";
import connectDB from "./config/database.js";
import { getConnectionStats } from "./utils/dbMonitor.js";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { jwtAuthMiddleware } from "./middleware/jwtAuthMiddleware.js";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB ONCE at startup
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

let questionsData;
try {
  const questionsPath = path.join(
    __dirname,
    "..",
    "Client",
    "src",
    "components",
    "Custom",
    "questions.json"
  );
  const fileContent = fs.readFileSync(questionsPath, "utf-8");
  questionsData = JSON.parse(fileContent);
} catch (error) {
  console.error('❌ Failed to load questions.json:', error.message);
  process.exit(1);
}
app.get("/api/questions/:topicName", (req, res) => {
  const { topicName } = req.params;
  const questionsForTopic = questionsData[topicName];

  if (questionsForTopic) {
    res.json(questionsForTopic);
  } else {
    res.status(404).json({ message: "Topic not found" });
  }
});

app.use(
  cors({
    origin: ["http://localhost:5173", "https://prep-buddy-test.vercel.app", "https://prep-buddy-k75f.vercel.app"],
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: "true" }));
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("API is running...");
});

// Health check endpoint to verify DB connection
app.get("/health", async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    
    const stats = getConnectionStats();
    
    res.json({
      status: 'OK',
      database: states[dbState],
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      connectionStats: stats
    });
  } catch (error) {
    console.error('Health check error:', error);
    res.status(500).json({ 
      status: 'ERROR', 
      message: error.message,
      database: 'unknown'
    });
  }
});

app.use("/auth", authRouter);
app.use("/test", jwtAuthMiddleware, testRouter);
app.use("/upload", jwtAuthMiddleware, uploadRouter);
app.use("/progress", progressRouter);

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 SIGINT received. Closing MongoDB connection...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 SIGTERM received. Closing MongoDB connection...');
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed.');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error.message);
  }
  process.exit(0);
});
