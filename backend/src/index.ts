import express from "express";
import cors from "cors";
import { config } from "./config/env.js";
import { logger } from "./utils/logger.js";
import { errorHandler } from "./utils/errorHandler.js";
import { runMigrations } from "./db/migrate.js";

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

// Run migrations check on startup (only in production)
async function startServer() {
  if (config.nodeEnv === "production" && config.databaseUrl && !config.databaseUrl.includes("localhost")) {
    // Run migration check in background (don't block server startup)
    runMigrations().catch((error) => {
      logger.error("Migration check failed, but server will continue", error);
    });
  }

  app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
    logger.info(`Environment: ${config.nodeEnv}`);
  });
}

startServer();

