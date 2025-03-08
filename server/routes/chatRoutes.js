import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getChats } from "../controllers/chatController.js";

const router = Router();

router.get("/fetch-chats/:id", verifyToken, getChats);

export default router;
