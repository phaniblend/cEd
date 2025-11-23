import { Response } from "express";
import { taskClaimService } from "../services/taskClaimService.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { AuthRequest } from "../middlewares/auth.js";

export const claimTask = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const claim = await taskClaimService.claimTask(req.params.taskId, req.user.id);
  res.status(201).json({ success: true, claim });
});

export const submitClaim = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const claim = await taskClaimService.submitClaim(req.params.claimId, req.user.id, req.body);
  res.json({ success: true, claim });
});

export const updateClaimStatus = asyncHandler(async (req: AuthRequest, res: Response) => {
  const claim = await taskClaimService.updateClaimStatus(req.params.claimId, req.body);
  res.json({ success: true, claim });
});

export const getMyClaims = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const claims = await taskClaimService.getLearnerClaims(req.user.id);
  res.json({ success: true, claims });
});

