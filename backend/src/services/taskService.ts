import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { TaskStatus, TaskDifficulty } from "@prisma/client";

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description: string;
  githubIssueNumber?: number;
  status?: TaskStatus;
  difficulty: TaskDifficulty;
  tags: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  status?: TaskStatus;
  difficulty?: TaskDifficulty;
  tags?: string[];
}

export const taskService = {
  async getByProjectId(projectId: string) {
    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return prisma.task.findMany({
      where: { projectId },
      include: {
        taskClaims: {
          select: {
            id: true,
            learnerId: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            title: true,
            slug: true,
            githubOrg: true,
            githubRepo: true,
          },
        },
        taskClaims: {
          include: {
            learner: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return task;
  },

  async create(input: CreateTaskInput) {
    // Verify project exists
    const project = await prisma.project.findUnique({ where: { id: input.projectId } });
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return prisma.task.create({
      data: {
        ...input,
        status: input.status || TaskStatus.OPEN,
      },
    });
  },

  async update(id: string, input: UpdateTaskInput) {
    const task = await prisma.task.findUnique({ where: { id } });
    if (!task) {
      throw new AppError(404, "Task not found");
    }

    return prisma.task.update({
      where: { id },
      data: input,
    });
  },
};

