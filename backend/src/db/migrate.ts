import { PrismaClient } from "@prisma/client";
import { logger } from "../utils/logger.js";

let prisma: PrismaClient;

async function runMigrations() {
  try {
    logger.info("Checking database connection...");
    
    // Create a new Prisma client for migrations
    prisma = new PrismaClient();
    
    // Test connection
    await prisma.$connect();
    logger.info("Database connected successfully!");
    
    // Check if we need to seed
    const userCount = await prisma.user.count();
    if (userCount === 0) {
      logger.info("Database is empty - seed will be run by start script if needed");
    } else {
      logger.info(`Database already has ${userCount} users, skipping seed`);
    }
    
    logger.info("Database check completed!");
  } catch (error: any) {
    logger.error("Database migration/check failed", error);
    // Don't throw - let the app start anyway
    logger.warn("Continuing startup despite migration check failure");
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

export { runMigrations };

