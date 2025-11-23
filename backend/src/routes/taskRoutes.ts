import express from "express";
import {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
} from "../controllers/taskController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/projects/:projectId/tasks", getTasksByProject);
router.get("/:taskId", getTaskById);
router.post("/projects/:projectId/tasks", authenticate, requireRole("ADMIN"), createTask);
router.patch("/:taskId", authenticate, requireRole("ADMIN"), updateTask);

export default router;

