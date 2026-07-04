import { Router } from "express";
import {
  saveJob,
  unsaveJob,
  getSavedJobs,
} from "../controllers/saveJob.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/save/:jobId", isAuthenticated, saveJob);
router.delete("/unsave/:jobId", isAuthenticated, unsaveJob);
router.get("/", isAuthenticated, getSavedJobs);

export default router;
