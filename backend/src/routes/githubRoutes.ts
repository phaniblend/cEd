import express from "express";
import {
  getInstallations,
  getInstallationRepos,
  getRepoIssues,
} from "../controllers/githubController.js";
import { authenticate } from "../middlewares/auth.js";

const router = express.Router();

router.get("/installations", authenticate, getInstallations);
router.get("/installations/:installationId/repos", authenticate, getInstallationRepos);
router.get("/repos/:owner/:repo/issues", authenticate, getRepoIssues);

export default router;

