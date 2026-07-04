import { Router } from "express";

import { isAuthenticated } from "../middleware/auth.middleware.js";
import {
  createResume,
  getUserResumes,
  getResumeById,
  updateResume,
  deleteResume,
  uploadResumeImages,
} from "../controllers/resume.controller.js";
import { resumeUpload } from "../middleware/uploadsResume.js";

const router = Router();

router.post("/", isAuthenticated, createResume);
router.get("/", isAuthenticated, getUserResumes);
router.get("/:id", isAuthenticated, getResumeById);
router.put("/:id", isAuthenticated, updateResume);
router.put("/upload-images/:id", isAuthenticated, resumeUpload, uploadResumeImages);

router.delete("/:id", isAuthenticated, deleteResume);

export default router;
