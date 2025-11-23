import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { TaskStatus, TaskDifficulty } from "@prisma/client";
import { githubService } from "./githubService.js";
import { logger } from "../utils/logger.js";

export interface CreateTaskInput {
  projectId: string;
  title: string;
  description: string;
  tech: string; // Tech identifier (e.g., "react", "vue", "angular")
  installationId?: number; // GitHub App installation ID (optional, will try to find from project)
  githubIssueNumber?: number;
  status?: TaskStatus;
  difficulty: TaskDifficulty;
  tags: string[];
}

export interface UpdateTaskInput {
  title?: string;
  description?: string;
  tech?: string;
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
    // Verify project exists and get full project details
    const project = await prisma.project.findUnique({ 
      where: { id: input.projectId },
      include: { tasks: true } // Include existing tasks to reference them
    });
    if (!project) {
      throw new AppError(404, "Project not found");
    }

    // Ensure we have the repo information
    if (!project.githubOrg || !project.githubRepo) {
      throw new AppError(400, "Project must have a GitHub repository before creating tasks");
    }

    // Create GitHub issue in the project's repo
    let githubIssueNumber = input.githubIssueNumber;
    if (!githubIssueNumber) {
      try {
        // Use provided installationId or try to find one
        let installationId = input.installationId;
        if (!installationId) {
          const installations = await githubService.getInstallations();
          if (installations.length > 0) {
            // Try to find installation that matches the project's org
            const matchingInstallation = installations.find(
              (inst: any) => inst.account?.login === project.githubOrg
            );
            installationId = matchingInstallation?.id || installations[0].id;
          }
        }

        if (installationId) {
          // Enhance issue body with context
          const issueBody = taskService.buildIssueBody(input, project);
          
          const issue = await githubService.createIssue(
            installationId,
            project.githubOrg,
            project.githubRepo,
            input.title,
            issueBody
          );
          githubIssueNumber = issue.number;
          logger.info(`Created GitHub issue #${githubIssueNumber} in ${project.githubOrg}/${project.githubRepo} for task: ${input.title}`);
        } else {
          logger.warn("No GitHub installation found, task created without GitHub issue");
        }
      } catch (error: any) {
        logger.error("Failed to create GitHub issue", error);
        // Continue without GitHub issue - task will still be created
        logger.warn("Task created but GitHub issue creation failed. You can create the issue manually.");
      }
    }

    return prisma.task.create({
      data: {
        projectId: input.projectId,
        title: input.title,
        description: input.description,
        tech: input.tech,
        githubIssueNumber,
        status: input.status || TaskStatus.OPEN,
        difficulty: input.difficulty,
        tags: input.tags,
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

  /**
   * Builds a rich issue body with context about the task and project
   */
  buildIssueBody(input: CreateTaskInput, project: any): string {
    const repoUrl = `https://github.com/${project.githubOrg}/${project.githubRepo}`;
    const projectUrl = `${process.env.FRONTEND_URL || 'https://ced.app'}/apps/${project.slug}`;
    
    let body = `## 📝 Task Description\n\n${input.description}\n\n`;
    
    body += `## 🔗 Project Context\n\n`;
    body += `- **Project**: [${project.title}](${projectUrl})\n`;
    body += `- **Repository**: [${project.githubOrg}/${project.githubRepo}](${repoUrl})\n`;
    body += `- **Tech Stack**: ${project.techStack.join(", ")}\n`;
    body += `- **Difficulty**: ${input.difficulty}\n\n`;
    
    if (input.tech) {
      body += `## 🏷️ Tech Identifier\n\n`;
      body += `This task is tagged with: **${input.tech}**\n\n`;
      body += `*Learners with skills in ${input.tech} can find this task by filtering for "${input.tech}"*\n\n`;
    }
    
    if (input.tags && input.tags.length > 0) {
      body += `## 🏷️ Tags\n\n`;
      body += input.tags.map(tag => `\`${tag}\``).join(" ") + `\n\n`;
    }
    
    body += `---\n\n`;
    body += `## 🚀 Getting Started\n\n`;
    body += `1. Claim this task on the [cEd platform](${projectUrl})\n`;
    body += `2. Clone the repository: \`git clone ${repoUrl}.git\`\n`;
    body += `3. Follow the project setup instructions in the README\n`;
    body += `4. Create a branch for your work: \`git checkout -b task/${input.title.toLowerCase().replace(/\s+/g, '-')}\`\n`;
    body += `5. Submit your PR when ready!\n\n`;
    
    body += `---\n\n`;
    body += `*This issue was created automatically by cEd. `;
    body += `Learners can claim this task and work on it through the [cEd platform](${projectUrl}).*\n`;
    
    return body;
  },
};

