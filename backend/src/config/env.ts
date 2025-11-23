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

// Validate required env vars in production
if (config.nodeEnv === "production") {
  if (!config.github.appId || !config.github.privateKey) {
    throw new Error("GITHUB_APP_ID and GITHUB_PRIVATE_KEY are required in production");
  }
}

