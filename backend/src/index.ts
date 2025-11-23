import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./utils/errorHandler.js";
// Routes
import authRoutes from "./routes/authRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import taskClaimRoutes from "./routes/taskClaimRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import githubRoutes from "./routes/githubRoutes.js";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check
app.get("/", (req, res) => {
  res.json({ success: true, message: "cEd Backend API" });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/task-claims", taskClaimRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/github", githubRoutes);

// Error handler (must be last)
app.use(errorHandler);

const PORT = config.port;

// Start server (migrations and seeding are handled by start.sh script)
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
  logger.info(`Environment: ${config.nodeEnv}`);
});

