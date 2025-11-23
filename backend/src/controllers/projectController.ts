import { Request, Response } from "express";
import { projectService, ProjectFilters } from "../services/projectService.js";
import { asyncHandler } from "../utils/errorHandler.js";

export const getAllProjects = asyncHandler(async (req: Request, res: Response) => {
  const filters: ProjectFilters = {
    skills: req.query.skills ? (req.query.skills as string).split(",") : undefined,
    tag: req.query.tag as string | undefined,
    status: req.query.status as any,
    featured: req.query.featured === "true" ? true : req.query.featured === "false" ? false : undefined,
  };

  const projects = await projectService.getAll(filters);
  res.json({ success: true, projects });
});

export const getProjectById = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getById(req.params.projectId);
  res.json({ success: true, project });
});

export const getProjectBySlug = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.getBySlug(req.params.slug);
  res.json({ success: true, project });
});

export const createProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.create(req.body);
  res.status(201).json({ success: true, project });
});

export const updateProject = asyncHandler(async (req: Request, res: Response) => {
  const project = await projectService.update(req.params.projectId, req.body);
  res.json({ success: true, project });
});

export const deleteProject = asyncHandler(async (req: Request, res: Response) => {
  await projectService.delete(req.params.projectId);
  res.json({ success: true, message: "Project deleted" });
});

