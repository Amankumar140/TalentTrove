import { Router } from "express";
import verifyToken from "../middleware/verifyToken.js";
import {
  getProject,
  getAllProjects,
  createProject,
  submitProject,
  approveSubmission,
  rejectSubmission,
} from "../controllers/projectController.js";

const router = Router();

router.get("/fetch-project/:id", verifyToken, getProject);
router.get("/fetch-projects", verifyToken, getAllProjects);
router.post("/new-project", verifyToken, createProject);
router.post("/submit-project", verifyToken, submitProject);
router.get("/approve-submission/:id", verifyToken, approveSubmission);
router.get("/reject-submission/:id", verifyToken, rejectSubmission);

export default router;
