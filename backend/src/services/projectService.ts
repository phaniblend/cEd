import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { ProjectDifficulty, ProjectStatus } from "@prisma/client";
import { githubService } from "./githubService.js";
import { generateStarterCode } from "./starterCodeService.js";
import { logger } from "../utils/logger.js";

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  techStackTemplate: string; // e.g., "react-vite", "nextjs", "vue-nuxt", "angular"
  installationId: number; // GitHub App installation ID
  githubOrg?: string; // Will be set from installation
  githubRepo?: string; // Will be generated from slug
  difficulty: ProjectDifficulty;
  status?: ProjectStatus;
  tags: string[];
  featured?: boolean;
  liveAppUrl?: string;
}

export interface UpdateProjectInput {
  title?: string;
  description?: string;
  techStack?: string[];
  difficulty?: ProjectDifficulty;
  status?: ProjectStatus;
  tags?: string[];
  featured?: boolean;
  liveAppUrl?: string;
}

export interface ProjectFilters {
  skills?: string[];
  tag?: string;
  status?: ProjectStatus;
  featured?: boolean;
  tech?: string; // Filter by tech (e.g., "react", "vue", "angular")
}

export const projectService = {
  async getAll(filters: ProjectFilters = {}) {
    const { skills, tag, status, featured, tech } = filters;

    const where: any = {};
    if (status) where.status = status;
    if (featured !== undefined) where.featured = featured;
    if (tag) where.tags = { has: tag };
    if (skills && skills.length > 0) {
      where.techStack = { hasSome: skills };
    }
    // Filter by tech - check if any task has this tech
    if (tech) {
      where.tasks = {
        some: {
          tech: {
            equals: tech,
            mode: "insensitive",
          },
        },
      };
    }

    return prisma.project.findMany({
      where,
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
            difficulty: true,
            tech: true,
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

    // Extract only the fields that belong to Prisma schema
    const { techStackTemplate, installationId, ...projectData } = input;
    
    return prisma.project.create({
      data: {
        ...projectData,
        githubOrg: projectData.githubOrg || "ced-projects", // Ensure it's always a string
        githubRepo: projectData.githubRepo || input.slug, // Ensure it's always a string
        status: input.status || ProjectStatus.ACTIVE,
        featured: input.featured || false,
      },
    });
  },

  async createWithGitHub(input: CreateProjectInput) {
    // Check if slug exists
    const existing = await prisma.project.findUnique({ where: { slug: input.slug } });
    if (existing) {
      throw new AppError(400, "Project with this slug already exists");
    }

    // Get installation info to determine org
    const installations = await githubService.getInstallations();
    const installation = installations.find((inst: any) => inst.id === input.installationId);
    
    if (!installation) {
      throw new AppError(404, `GitHub installation ${input.installationId} not found`);
    }

    // Handle both user and organization account types
    const account = installation.account as any;
    const githubOrg = (account?.login || account?.name || input.githubOrg || "ced-projects") as string;
    const githubRepo = (input.githubRepo || input.slug) as string;

    // Create GitHub repository
    let repo;
    try {
      repo = await githubService.createRepository(
        input.installationId,
        githubRepo,
        input.description,
        false // public repo
      );
      logger.info(`Created GitHub repo: ${repo.full_name}`);
    } catch (error: any) {
      logger.error("Failed to create GitHub repo", error);
      throw new AppError(500, `Failed to create GitHub repository: ${error.message}`);
    }

    // Generate and add starter code files using official CLI tools
    try {
      const starterCode = await generateStarterCode(input.techStackTemplate, input.title);
      if (starterCode && starterCode.files) {
        logger.info(`Generated ${Object.keys(starterCode.files).length} starter files for ${input.techStackTemplate}`);
        
        // Commit all files to GitHub
        for (const [filePath, content] of Object.entries(starterCode.files)) {
          try {
            await githubService.createFile(
              input.installationId,
              githubOrg,
              githubRepo,
              filePath,
              content as string,
              `Initial commit: Add ${filePath}`,
              "main"
            );
          } catch (fileError: any) {
            // If file already exists (e.g., README.md from repo creation), try to update it
            logger.warn(`Failed to create file ${filePath}, may already exist: ${fileError.message}`);
          }
        }
        logger.info(`Added starter code files to ${repo.full_name}`);
      } else {
        logger.warn(`No starter code generated for tech stack: ${input.techStackTemplate}`);
      }
    } catch (error: any) {
      logger.error("Failed to generate/add starter code", error);
      // Continue even if starter code fails - repo is created
      logger.warn("Repository created but starter code generation failed. You can add files manually.");
    }

    // Create project in database
    const project = await prisma.project.create({
      data: {
        title: input.title,
        slug: input.slug,
        description: input.description,
        techStack: input.techStack,
        githubOrg,
        githubRepo,
        difficulty: input.difficulty,
        status: input.status || ProjectStatus.ACTIVE,
        tags: input.tags,
        featured: input.featured || false,
        liveAppUrl: input.liveAppUrl,
      },
    });

    // Create a main project issue that will track all tasks
    try {
      const projectIssueBody = projectService.buildProjectIssueBody(project, input);
      const projectIssue = await githubService.createIssue(
        input.installationId,
        githubOrg,
        githubRepo,
        `📋 Project: ${input.title}`,
        projectIssueBody
      );
      logger.info(`Created main project issue #${projectIssue.number} for ${repo.full_name}`);
    } catch (error: any) {
      logger.error("Failed to create main project issue", error);
      // Continue - project is created, issue is optional
    }

    return project;
  },

  /**
   * Builds the main project issue body that will track all tasks
   */
  buildProjectIssueBody(project: any, input: CreateProjectInput): string {
    const repoUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;
    const projectUrl = `${process.env.FRONTEND_URL || 'https://ced.app'}/apps/${project.slug}`;
    
    let body = `# ${input.title}\n\n`;
    body += `${input.description}\n\n`;
    
    body += `## Project Details\n\n`;
    body += `- **Repository**: [${project.githubOrg}/${project.githubRepo}](${repoUrl})\n`;
    body += `- **Project Page**: [View on cEd](${projectUrl})\n`;
    body += `- **Tech Stack**: ${input.techStack.join(", ")}\n`;
    body += `- **Difficulty**: ${input.difficulty}\n`;
    body += `- **Status**: ${input.status || ProjectStatus.ACTIVE}\n\n`;
    
    if (input.tags && input.tags.length > 0) {
      body += `## Tags\n\n`;
      body += input.tags.map(tag => `\`${tag}\``).join(" ") + `\n\n`;
    }
    
    body += `## Tasks\n\n`;
    body += `Tasks for this project will be listed below. Each task will be created as a separate issue.\n\n`;
    body += `- [ ] Tasks will appear here as they are created\n\n`;
    
    body += `---\n\n`;
    body += `*This project was created through cEd. `;
    body += `Learners can browse tasks and contribute to this project.*\n`;
    
    return body;
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

