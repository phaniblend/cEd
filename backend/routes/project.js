import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createProject, listProjects } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", authMiddleware, createProject);
router.get("/", authMiddleware, listProjects);

export default router;
