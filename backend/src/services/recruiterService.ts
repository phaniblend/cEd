import prisma from "../db/client.js";
import { TaskClaimStatus } from "@prisma/client";

export interface RecruiterFilters {
  skills?: string[];
  minAccepted?: number;
}

export const recruiterService = {
  async getLearners(filters: RecruiterFilters = {}) {
    const { skills, minAccepted = 0 } = filters;

    const where: any = {
      role: "LEARNER",
    };

    if (skills && skills.length > 0) {
      where.skills = { hasSome: skills };
    }

    const learners = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        skills: true,
        createdAt: true,
        taskClaims: {
          select: {
            status: true,
          },
        },
      },
    });

    // Calculate stats and filter by minAccepted
    const learnersWithStats = learners
      .map((learner) => {
        const claims = learner.taskClaims;
        const totalClaimed = claims.length;
        const totalSubmitted = claims.filter((c) => c.status === TaskClaimStatus.SUBMITTED || c.status === TaskClaimStatus.ACCEPTED || c.status === TaskClaimStatus.REJECTED).length;
        const totalAccepted = claims.filter((c) => c.status === TaskClaimStatus.ACCEPTED).length;

        return {
          id: learner.id,
          name: learner.name,
          email: learner.email,
          headline: learner.headline,
          skills: learner.skills,
          createdAt: learner.createdAt,
          totalTasksClaimed: totalClaimed,
          totalTasksSubmitted: totalSubmitted,
          totalTasksAccepted: totalAccepted,
        };
      })
      .filter((learner) => learner.totalTasksAccepted >= minAccepted);

    return learnersWithStats;
  },

  async getLearnerDetails(learnerId: string) {
    const learner = await prisma.user.findUnique({
      where: { id: learnerId, role: "LEARNER" },
      select: {
        id: true,
        name: true,
        email: true,
        headline: true,
        skills: true,
        createdAt: true,
        taskClaims: {
          where: {
            status: TaskClaimStatus.ACCEPTED,
          },
          include: {
            task: {
              include: {
                project: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                    techStack: true,
                    liveAppUrl: true,
                    featured: true,
                  },
                },
              },
            },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!learner) {
      throw new Error("Learner not found");
    }

    const claims = learner.taskClaims;
    const totalClaimed = await prisma.taskClaim.count({
      where: { learnerId },
    });
    const totalSubmitted = await prisma.taskClaim.count({
      where: {
        learnerId,
        status: {
          in: [TaskClaimStatus.SUBMITTED, TaskClaimStatus.ACCEPTED, TaskClaimStatus.REJECTED],
        },
      },
    });
    const totalAccepted = claims.length;

    return {
      ...learner,
      totalTasksClaimed: totalClaimed,
      totalTasksSubmitted: totalSubmitted,
      totalTasksAccepted: totalAccepted,
    };
  },
};

