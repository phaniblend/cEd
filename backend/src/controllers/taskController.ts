import { Request, Response } from "express";
import { taskService } from "../services/taskService.js";
import { asyncHandler } from "../utils/errorHandler.js";

export const getTasksByProject = asyncHandler(async (req: Request, res: Response) => {
  const tasks = await taskService.getByProjectId(req.params.projectId);
  res.json({ success: true, tasks });
});

export const getTaskById = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.getById(req.params.taskId);
  res.json({ success: true, task });
});

export const createTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.create({
    ...req.body,
    projectId: req.params.projectId,
  });
  res.status(201).json({ success: true, task });
});

export const updateTask = asyncHandler(async (req: Request, res: Response) => {
  const task = await taskService.update(req.params.taskId, req.body);
  res.json({ success: true, task });
});

