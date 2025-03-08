import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import { getFreelancer, updateFreelancer } from "../controllers/freelancerController.js";

const router = Router();

router.get("/fetch-freelancer/:id", verifyToken, getFreelancer);
router.post("/update-freelancer", verifyToken, updateFreelancer);

export default router;
