#!/bin/bash
set -e

echo "=== Starting cEd Backend ==="

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Push schema to database (if DATABASE_URL is set)
if [ -n "$DATABASE_URL" ]; then
  echo "Pushing database schema..."
  npx prisma db push --accept-data-loss || echo "Database push failed, continuing..."
  
  # Check if we need to seed (only if database is empty)
  echo "Checking if database needs seeding..."
  USER_COUNT=$(node -e "
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    prisma.user.count().then(count => {
      console.log(count);
      prisma.\$disconnect();
    }).catch((err) => {
      console.log('0');
      prisma.\$disconnect();
    });
  " 2>/dev/null || echo "0")
  
  if [ "$USER_COUNT" = "0" ] || [ -z "$USER_COUNT" ]; then
    echo "Database is empty, running seed..."
    npx tsx prisma/seed.ts || echo "Seed failed, continuing..."
  else
    echo "Database already has $USER_COUNT users, skipping seed"
  fi
else
  echo "DATABASE_URL not set, skipping database setup"
fi

# Start the server
echo "Starting server..."
node dist/index.js

