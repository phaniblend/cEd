import { Request, Response } from "express";
import { githubService } from "../services/githubService.js";
import { asyncHandler } from "../utils/errorHandler.js";

export const getInstallations = asyncHandler(async (req: Request, res: Response) => {
  const installations = await githubService.getInstallations();
  res.json({ success: true, installations });
});

export const getInstallationRepos = asyncHandler(async (req: Request, res: Response) => {
  const installationId = parseInt(req.params.installationId, 10);
  if (isNaN(installationId)) {
    return res.status(400).json({ success: false, message: "Invalid installation ID" });
  }
  const repos = await githubService.getInstallationRepos(installationId);
  res.json({ success: true, repos });
});

export const getRepoIssues = asyncHandler(async (req: Request, res: Response) => {
  const { owner, repo } = req.params;
  const issues = await githubService.getRepoIssues(owner, repo);
  res.json({ success: true, issues });
});

