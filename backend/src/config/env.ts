import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || "5000", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  databaseUrl: process.env.DATABASE_URL || "postgresql://user:password@localhost:5432/ced?schema=public",
  jwtSecret: process.env.JWT_SECRET || "change-me-in-production",
  github: {
    appId: process.env.GITHUB_APP_ID || "",
    privateKey: process.env.GITHUB_PRIVATE_KEY || "",
    clientId: process.env.GITHUB_CLIENT_ID || "",
    clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
    webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || "",
  },
} as const;

// Note: GitHub credentials are optional - app will use mock data if not provided
// This allows the app to run in production without GitHub App setup initially

