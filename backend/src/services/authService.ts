import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config/env.js";
import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { UserRole } from "@prisma/client";

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
  headline?: string;
  skills?: string[];
}

export interface LoginInput {
  email: string;
  password: string;
}

export const authService = {
  async register(input: RegisterInput) {
    const { name, email, password, role = UserRole.LEARNER, headline, skills = [] } = input;

    // Validate required fields
    if (!name || !email || !password) {
      throw new AppError(400, "Name, email, and password are required");
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new AppError(400, "Invalid email format");
    }

    // Validate password length
    if (password.length < 6) {
      throw new AppError(400, "Password must be at least 6 characters");
    }

    try {
      // Check if user exists
      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        throw new AppError(400, "User with this email already exists");
      }

      // Hash password
      const passwordHash = await bcrypt.hash(password, 10);

      // Create user
      const user = await prisma.user.create({
        data: {
          name,
          email,
          passwordHash,
          role,
          headline,
          skills,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          headline: true,
          skills: true,
          createdAt: true,
        },
      });

      // Generate token
      const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });

      return { user, token };
    } catch (error: any) {
      // If it's already an AppError, re-throw it
      if (error instanceof AppError) {
        throw error;
      }
      // Log database errors for debugging
      console.error("Database error during registration:", error);
      throw new AppError(500, `Registration failed: ${error.message || "Database error"}`);
    }
  },

  async login(input: LoginInput) {
    const { email, password } = input;

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, "Invalid email or password");
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      throw new AppError(401, "Invalid email or password");
    }

    // Generate token
    const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: "7d" });

    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        headline: user.headline,
        skills: user.skills,
        createdAt: user.createdAt,
      },
      token,
    };
  },

  async getCurrentUser(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        headline: true,
        skills: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new AppError(404, "User not found");
    }

    return user;
  },
};

