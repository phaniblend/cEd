import express from "express";
import {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/projectController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", getAllProjects);
router.get("/slug/:slug", getProjectBySlug);
router.get("/:projectId", getProjectById);
router.post("/", authenticate, requireRole("ADMIN"), createProject);
router.patch("/:projectId", authenticate, requireRole("ADMIN"), updateProject);
router.delete("/:projectId", authenticate, requireRole("ADMIN"), deleteProject);

export default router;

