import { Request, Response } from "express";
import { recruiterService, RecruiterFilters } from "../services/recruiterService.js";
import { asyncHandler } from "../utils/errorHandler.js";

export const getLearners = asyncHandler(async (req: Request, res: Response) => {
  const filters: RecruiterFilters = {
    skills: req.query.skills ? (req.query.skills as string).split(",") : undefined,
    minAccepted: req.query.minAccepted ? parseInt(req.query.minAccepted as string, 10) : undefined,
  };

  const learners = await recruiterService.getLearners(filters);
  res.json({ success: true, learners });
});

export const getLearnerDetails = asyncHandler(async (req: Request, res: Response) => {
  const learner = await recruiterService.getLearnerDetails(req.params.learnerId);
  res.json({ success: true, learner });
});

