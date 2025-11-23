import { Request, Response } from "express";
import { authService } from "../services/authService.js";
import { asyncHandler } from "../utils/errorHandler.js";
import { AuthRequest } from "../middlewares/auth.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.register(req.body);
  res.status(201).json({ success: true, ...result });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await authService.login(req.body);
  res.json({ success: true, ...result });
});

export const getMe = asyncHandler(async (req: AuthRequest, res: Response) => {
  if (!req.user) {
    return res.status(401).json({ success: false, message: "Not authenticated" });
  }
  const user = await authService.getCurrentUser(req.user.id);
  res.json({ success: true, user });
});

