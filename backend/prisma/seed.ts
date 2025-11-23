import { PrismaClient, UserRole, ProjectDifficulty, ProjectStatus, TaskStatus, TaskDifficulty, TaskClaimStatus } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // Clear existing data
  await prisma.taskClaim.deleteMany();
  await prisma.task.deleteMany();
  await prisma.project.deleteMany();
  await prisma.user.deleteMany();

  // Create users
  const passwordHash = await bcrypt.hash("password123", 10);

  const learner1 = await prisma.user.create({
    data: {
      name: "Alice Developer",
      email: "alice@example.com",
      passwordHash,
      role: UserRole.LEARNER,
      headline: "Full-stack developer passionate about React and Node.js",
      skills: ["React", "Node.js", "TypeScript", "PostgreSQL"],
    },
  });

  const learner2 = await prisma.user.create({
    data: {
      name: "Bob Coder",
      email: "bob@example.com",
      passwordHash,
      role: UserRole.LEARNER,
      headline: "Backend engineer learning modern web development",
      skills: ["Python", "Django", "PostgreSQL", "Docker"],
    },
  });

  const recruiter = await prisma.user.create({
    data: {
      name: "Carol Recruiter",
      email: "carol@example.com",
      passwordHash,
      role: UserRole.RECRUITER,
      headline: "Tech recruiter",
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@example.com",
      passwordHash,
      role: UserRole.ADMIN,
    },
  });

  // Create projects
  const todoProject = await prisma.project.create({
    data: {
      title: "React Todo App",
      slug: "react-todo-app",
      description: "A modern, feature-rich todo application built with React and TypeScript. Includes drag-and-drop, filtering, and local storage persistence.",
      techStack: ["React", "TypeScript", "TailwindCSS", "Vite"],
      githubOrg: "ced-projects",
      githubRepo: "react-todo-app",
      difficulty: ProjectDifficulty.BEGINNER,
      status: ProjectStatus.ACTIVE,
      tags: ["todo-app", "frontend", "react"],
      featured: true,
      liveAppUrl: "https://react-todo-demo.example.com",
    },
  });

  const crmProject = await prisma.project.create({
    data: {
      title: "CRM Lite",
      slug: "crm-lite",
      description: "A lightweight Customer Relationship Management system for small businesses. Built with Node.js, Express, and PostgreSQL.",
      techStack: ["Node.js", "Express", "PostgreSQL", "TypeScript", "React"],
      githubOrg: "ced-projects",
      githubRepo: "crm-lite",
      difficulty: ProjectDifficulty.INTERMEDIATE,
      status: ProjectStatus.ACTIVE,
      tags: ["crm", "backend", "fullstack"],
      featured: true,
      liveAppUrl: "https://crm-lite-demo.example.com",
    },
  });

  const kanbanProject = await prisma.project.create({
    data: {
      title: "Simple Kanban Board",
      slug: "simple-kanban",
      description: "A collaborative kanban board application for task management. Real-time updates and team collaboration features.",
      techStack: ["React", "Node.js", "WebSockets", "PostgreSQL"],
      githubOrg: "ced-projects",
      githubRepo: "simple-kanban",
      difficulty: ProjectDifficulty.INTERMEDIATE,
      status: ProjectStatus.ACTIVE,
      tags: ["kanban", "project-management", "fullstack"],
      featured: true,
      liveAppUrl: "https://kanban-demo.example.com",
    },
  });

  const blogProject = await prisma.project.create({
    data: {
      title: "Markdown Blog Platform",
      slug: "markdown-blog",
      description: "A blogging platform that supports Markdown. Features include syntax highlighting, tags, and search functionality.",
      techStack: ["Next.js", "TypeScript", "Markdown", "PostgreSQL"],
      githubOrg: "ced-projects",
      githubRepo: "markdown-blog",
      difficulty: ProjectDifficulty.ADVANCED,
      status: ProjectStatus.ACTIVE,
      tags: ["blog", "cms", "nextjs"],
      featured: false,
    },
  });

  const apiProject = await prisma.project.create({
    data: {
      title: "REST API Starter",
      slug: "rest-api-starter",
      description: "A production-ready REST API template with authentication, validation, and documentation.",
      techStack: ["Node.js", "Express", "TypeScript", "PostgreSQL", "JWT"],
      githubOrg: "ced-projects",
      githubRepo: "rest-api-starter",
      difficulty: ProjectDifficulty.INTERMEDIATE,
      status: ProjectStatus.ACTIVE,
      tags: ["api", "backend", "starter"],
      featured: false,
    },
  });

  // Create tasks for React Todo App
  const todoTask1 = await prisma.task.create({
    data: {
      projectId: todoProject.id,
      title: "Implement drag-and-drop functionality",
      description: "Add drag-and-drop support to reorder todo items. Use a library like @dnd-kit or react-beautiful-dnd.",
      githubIssueNumber: 1,
      status: TaskStatus.COMPLETED,
      difficulty: TaskDifficulty.MEDIUM,
      tags: ["feature", "ui"],
    },
  });

  const todoTask2 = await prisma.task.create({
    data: {
      projectId: todoProject.id,
      title: "Add filtering by status",
      description: "Implement filters to show all, active, or completed todos.",
      githubIssueNumber: 2,
      status: TaskStatus.OPEN,
      difficulty: TaskDifficulty.EASY,
      tags: ["feature"],
    },
  });

  const todoTask3 = await prisma.task.create({
    data: {
      projectId: todoProject.id,
      title: "Add local storage persistence",
      description: "Save todos to browser local storage so they persist across sessions.",
      githubIssueNumber: 3,
      status: TaskStatus.IN_PROGRESS,
      difficulty: TaskDifficulty.EASY,
      tags: ["feature", "storage"],
    },
  });

  // Create tasks for CRM Lite
  const crmTask1 = await prisma.task.create({
    data: {
      projectId: crmProject.id,
      title: "Implement contact CRUD operations",
      description: "Create API endpoints and UI for creating, reading, updating, and deleting contacts.",
      githubIssueNumber: 1,
      status: TaskStatus.COMPLETED,
      difficulty: TaskDifficulty.MEDIUM,
      tags: ["backend", "api"],
    },
  });

  const crmTask2 = await prisma.task.create({
    data: {
      projectId: crmProject.id,
      title: "Add contact search functionality",
      description: "Implement search to filter contacts by name, email, or company.",
      githubIssueNumber: 2,
      status: TaskStatus.OPEN,
      difficulty: TaskDifficulty.MEDIUM,
      tags: ["feature", "search"],
    },
  });

  // Create tasks for Kanban
  const kanbanTask1 = await prisma.task.create({
    data: {
      projectId: kanbanProject.id,
      title: "Create board and column components",
      description: "Build the basic UI structure for boards and columns.",
      githubIssueNumber: 1,
      status: TaskStatus.OPEN,
      difficulty: TaskDifficulty.EASY,
      tags: ["ui", "component"],
    },
  });

  // Create task claims
  await prisma.taskClaim.create({
    data: {
      taskId: todoTask1.id,
      learnerId: learner1.id,
      status: TaskClaimStatus.ACCEPTED,
      githubPullRequestUrl: "https://github.com/ced-projects/react-todo-app/pull/1",
      reviewNotes: "Great implementation! Code is clean and well-documented.",
    },
  });

  await prisma.taskClaim.create({
    data: {
      taskId: crmTask1.id,
      learnerId: learner1.id,
      status: TaskClaimStatus.ACCEPTED,
      githubPullRequestUrl: "https://github.com/ced-projects/crm-lite/pull/1",
      reviewNotes: "Excellent work on the API design.",
    },
  });

  await prisma.taskClaim.create({
    data: {
      taskId: todoTask3.id,
      learnerId: learner2.id,
      status: TaskClaimStatus.SUBMITTED,
      githubPullRequestUrl: "https://github.com/ced-projects/react-todo-app/pull/2",
    },
  });

  await prisma.taskClaim.create({
    data: {
      taskId: crmTask2.id,
      learnerId: learner2.id,
      status: TaskClaimStatus.CLAIMED,
    },
  });

  console.log("Seeding completed!");
  console.log(`Created ${await prisma.user.count()} users`);
  console.log(`Created ${await prisma.project.count()} projects`);
  console.log(`Created ${await prisma.task.count()} tasks`);
  console.log(`Created ${await prisma.taskClaim.count()} task claims`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

