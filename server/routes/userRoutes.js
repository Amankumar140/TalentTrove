import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getAllUsers } from "../controllers/userController.js";

const router = Router();

router.get("/fetch-users", verifyToken, getAllUsers);

export default router;
