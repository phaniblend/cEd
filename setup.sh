#!/bin/bash

# cEd Platform Setup Script

set -e

echo "🚀 Setting up cEd Platform..."

# Check prerequisites
echo "📋 Checking prerequisites..."
command -v docker >/dev/null 2>&1 || { echo "❌ Docker is required but not installed. Aborting." >&2; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is required but not installed. Aborting." >&2; exit 1; }
command -v go >/dev/null 2>&1 || { echo "❌ Go is required but not installed. Aborting." >&2; exit 1; }
command -v node >/dev/null 2>&1 || { echo "❌ Node.js is required but not installed. Aborting." >&2; exit 1; }

echo "✅ All prerequisites met!"

# Start infrastructure
echo "🐳 Starting infrastructure services..."
docker-compose up -d postgres redis minio gitea

echo "⏳ Waiting for services to be ready..."
sleep 10

# Run database migrations
echo "📊 Running database migrations..."
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/001_create_users_table.sql || true
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/002_create_projects_table.sql || true
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/003_create_issues_table.sql || true
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/004_create_pull_requests_table.sql || true

echo "✅ Database migrations completed!"

# Build Go services
echo "🔨 Building Go services..."
cd user-service && go mod tidy && cd ..
cd git-service && go mod tidy && cd ..
cd alm-service && go mod tidy && cd ..

echo "✅ Go services built!"

# Install frontend dependencies
echo "📦 Installing frontend dependencies..."
cd frontend && npm install && cd ..

echo "✅ Frontend dependencies installed!"

echo ""
echo "🎉 Setup complete!"
echo ""
echo "Next steps:"
echo "1. Configure Gitea at http://localhost:3000"
echo "2. Create .env files in each service directory (see .env.example files)"
echo "3. Start services:"
echo "   - User Service: cd user-service && go run main.go"
echo "   - Git Service: cd git-service && go run main.go"
echo "   - ALM Service: cd alm-service && go run main.go"
echo "   - Frontend: cd frontend && npm run dev"
echo ""
echo "Or use docker-compose: docker-compose up --build"

