import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { ProjectDifficulty, ProjectStatus } from "@prisma/client";

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubOrg: string;
  githubRepo: string;
  difficulty: ProjectDifficulty;
  status?: ProjectStatus;
  tags: string[];
  featured?: boolean;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  techStack?: string[];
  difficulty?: ProjectDifficulty;
  status?: ProjectStatus;
  tags?: string[];
  featured?: boolean;
}

export interface ProjectFilters {
  skills?: string[];
  tag?: string;
  status?: ProjectStatus;
  featured?: boolean;
}

export const projectService = {
  async getAll(filters: ProjectFilters = {}) {
    const { skills, tag, status, featured } = filters;

    const where: any = {};
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured;
    if (tag) where.tags = { has: tag };
    if (skills && skills.length > 0) {
      where.techStack = { hasSome: skills };
    }

    return prisma.project.findMany({
      where,
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            difficulty: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  async getById(id: string) {
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  },

  async getBySlug(slug: string) {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        tasks: {
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return project;
  },

  async create(input: CreateProjectInput) {
    // Check if slug exists
    const existing = await prisma.project.findUnique({ where: { slug: input.slug } });
    if (existing) {
      throw new AppError(400, "Project with this slug already exists");
    }

    return prisma.project.create({
      data: {
        ...input,
        status: input.status || ProjectStatus.ACTIVE,
        featured: input.featured || false,
      },
    });
  },

  async update(id: string, input: UpdateProjectInput) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    return prisma.project.update({
      where: { id },
      data: input,
    });
  },

  async delete(id: string) {
    const project = await prisma.project.findUnique({ where: { id } });
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    await prisma.project.delete({ where: { id } });
    return { success: true };
  },
};

