export enum UserRole {
  LEARNER = "LEARNER",
  RECRUITER = "RECRUITER",
  BUYER = "BUYER",
  ADMIN = "ADMIN",
}

export enum ProjectDifficulty {
  BEGINNER = "BEGINNER",
  INTERMEDIATE = "INTERMEDIATE",
  ADVANCED = "ADVANCED",
}

export enum ProjectStatus {
  ACTIVE = "ACTIVE",
  ARCHIVED = "ARCHIVED",
}

export enum TaskStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  BLOCKED = "BLOCKED",
}

export enum TaskDifficulty {
  EASY = "EASY",
  MEDIUM = "MEDIUM",
  HARD = "HARD",
}

export enum TaskClaimStatus {
  CLAIMED = "CLAIMED",
  SUBMITTED = "SUBMITTED",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  headline?: string;
  skills: string[];
  createdAt: string;
  updatedAt?: string;
}

export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubOrg: string;
  githubRepo: string;
  difficulty: ProjectDifficulty;
  status: ProjectStatus;
  tags: string[];
  featured: boolean;
  liveAppUrl?: string;
  createdAt: string;
  updatedAt: string;
  tasks?: Task[];
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  tech: string; // Tech identifier for filtering
  githubIssueNumber?: number;
  status: TaskStatus;
  difficulty: TaskDifficulty;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  project?: Project;
  taskClaims?: TaskClaim[];
}

export interface TaskClaim {
  id: string;
  taskId: string;
  learnerId: string;
  status: TaskClaimStatus;
  githubPullRequestUrl?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  task?: Task;
  learner?: User;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  [key: string]: any;
}

