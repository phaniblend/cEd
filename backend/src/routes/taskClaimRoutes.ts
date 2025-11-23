import express from "express";
import {
  claimTask,
  submitClaim,
  updateClaimStatus,
  getMyClaims,
} from "../controllers/taskClaimController.js";
import { authenticate, requireRole } from "../middlewares/auth.js";

const router = express.Router();

router.get("/my-claims", authenticate, getMyClaims);
router.post("/tasks/:taskId/claim", authenticate, claimTask);
router.post("/:claimId/submit", authenticate, submitClaim);
router.patch("/:claimId/status", authenticate, requireRole("ADMIN"), updateClaimStatus);

export default router;

