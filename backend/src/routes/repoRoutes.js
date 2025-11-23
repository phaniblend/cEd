import express from "express";
import {
  createRepository,
  createTaskBranch,
  commitToRepo,
  openPullRequest
} from "../controllers/repoController.js";

const router = express.Router();

router.post("/create", createRepository);
router.post("/branch", createTaskBranch);
router.post("/commit", commitToRepo);
router.post("/pr", openPullRequest);

export default router;
