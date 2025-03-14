import dotenv from "dotenv";

// ── Environment variables (must load BEFORE other imports use process.env) ──
dotenv.config();

import http from "http";
import { Server } from "socket.io";

import connectDB from "./config/db.js";
import app from "./app.js";
import socketHandler from "./socket/socketHandler.js";

const PORT = process.env.PORT || 6001;

// ── Allowed origins (shared with app.js via env) ────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

// ── HTTP + Socket.IO server ─────────────────────────────────────────────────
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);
  socketHandler(io, socket);
});

// ── Start ───────────────────────────────────────────────────────────────────
connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`TalentTrove server running @ port ${PORT}`);
  });
});
