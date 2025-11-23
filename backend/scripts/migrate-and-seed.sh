#!/bin/bash
set -e

echo "Running database migrations..."

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "Pushing schema to database..."
npx prisma db push --accept-data-loss

# Check if database is empty and seed if needed
echo "Checking if database needs seeding..."
USER_COUNT=$(npx tsx -e "import { PrismaClient } from '@prisma/client'; const prisma = new PrismaClient(); prisma.user.count().then(count => { console.log(count); prisma.\$disconnect(); });" 2>/dev/null || echo "0")

if [ "$USER_COUNT" = "0" ]; then
  echo "Database is empty, running seed..."
  npx tsx prisma/seed.ts
  echo "Seed completed!"
else
  echo "Database already has data, skipping seed"
fi

echo "Migrations completed successfully!"

