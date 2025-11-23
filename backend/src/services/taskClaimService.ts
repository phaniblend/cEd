import prisma from "../db/client.js";
import { AppError } from "../utils/errorHandler.js";
import { TaskClaimStatus } from "@prisma/client";

export interface SubmitClaimInput {
  githubPullRequestUrl: string;
}

export interface UpdateClaimStatusInput {
  status: TaskClaimStatus;
  reviewNotes?: string;
}

export const taskClaimService = {
  async claimTask(taskId: string, learnerId: string) {
    // Verify task exists
    const task = await prisma.task.findUnique({ where: { id: taskId } });
    if (!task) {
      throw new AppError(404, "Task not found");
    }

    // Check if already claimed by this learner
    const existing = await prisma.taskClaim.findUnique({
      where: {
        taskId_learnerId: {
          taskId,
          learnerId,
        },
      },
    });

    if (existing) {
      throw new AppError(400, "Task already claimed by you");
    }

    // Check if task is available
    if (task.status !== "OPEN" && task.status !== "IN_PROGRESS") {
      throw new AppError(400, "Task is not available for claiming");
    }

    // Create claim
    const claim = await prisma.taskClaim.create({
      data: {
        taskId,
        learnerId,
        status: TaskClaimStatus.CLAIMED,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "IN_PROGRESS" },
    });

    return claim;
  },

  async submitClaim(claimId: string, learnerId: string, input: SubmitClaimInput) {
    const claim = await prisma.taskClaim.findUnique({
      where: { id: claimId },
      include: { task: true },
    });

    if (!claim) {
      throw new AppError(404, "Task claim not found");
    }

    if (claim.learnerId !== learnerId) {
      throw new AppError(403, "You can only submit your own claims");
    }

    if (claim.status !== TaskClaimStatus.CLAIMED) {
      throw new AppError(400, "Claim is not in CLAIMED status");
    }

    return prisma.taskClaim.update({
      where: { id: claimId },
      data: {
        status: TaskClaimStatus.SUBMITTED,
        githubPullRequestUrl: input.githubPullRequestUrl,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            project: {
              select: {
                id: true,
                title: true,
              },
            },
          },
        },
      },
    });
  },

  async updateClaimStatus(claimId: string, input: UpdateClaimStatusInput) {
    const claim = await prisma.taskClaim.findUnique({
      where: { id: claimId },
      include: { task: true },
    });

    if (!claim) {
      throw new AppError(404, "Task claim not found");
    }

    const updated = await prisma.taskClaim.update({
      where: { id: claimId },
      data: {
        status: input.status,
        reviewNotes: input.reviewNotes,
      },
      include: {
        task: {
          select: {
            id: true,
            title: true,
            status: true,
          },
        },
        learner: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // If accepted, update task status
    if (input.status === TaskClaimStatus.ACCEPTED) {
      await prisma.task.update({
        where: { id: claim.taskId },
        data: { status: "COMPLETED" },
      });
    }

    return updated;
  },

  async getLearnerClaims(learnerId: string) {
    return prisma.taskClaim.findMany({
      where: { learnerId },
      include: {
        task: {
          include: {
            project: {
              select: {
                id: true,
                title: true,
                slug: true,
                techStack: true,
              },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },
};

