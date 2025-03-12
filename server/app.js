import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

// ── Route imports ──────────────────────────────────────────────────────────
import authRoutes from "./routes/authRoutes.js";
import freelancerRoutes from "./routes/freelancerRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

// ── Middleware imports ─────────────────────────────────────────────────────
import errorHandler from "./middleware/errorHandler.js";

// ── App initialisation ─────────────────────────────────────────────────────
const app = express();

// ── CORS ────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

// ── Body parsers ────────────────────────────────────────────────────────────
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// ── Health check ────────────────────────────────────────────────────────────
app.get("/", (req, res) => {
  res.send("TalentTrove Backend is Live!");
});

// ── API routes ──────────────────────────────────────────────────────────────
app.use(authRoutes);
app.use(freelancerRoutes);
app.use(projectRoutes);
app.use(applicationRoutes);
app.use(userRoutes);
app.use(chatRoutes);

// ── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
