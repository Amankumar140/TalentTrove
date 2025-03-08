import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  makeBid,
  getAllApplications,
  approveApplication,
  rejectApplication,
} from "../controllers/applicationController.js";

const router = Router();

router.post("/make-bid", verifyToken, makeBid);
router.get("/fetch-applications", verifyToken, getAllApplications);
router.get("/approve-application/:id", verifyToken, approveApplication);
router.get("/reject-application/:id", verifyToken, rejectApplication);

export default router;
