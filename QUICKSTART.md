# cEd Platform - Quick Start Guide

## 🚀 Getting Started in 4 Hours

### Step 1: Prerequisites

Ensure you have installed:
- Go 1.21+ ([download](https://go.dev/dl/))
- Docker & Docker Compose ([download](https://www.docker.com/products/docker-desktop))
- Node.js 18+ ([download](https://nodejs.org/))

### Step 2: Start Infrastructure

```bash
# Start PostgreSQL, Redis, MinIO, and Gitea
docker-compose up -d postgres redis minio gitea

# Wait for services to be healthy (about 30 seconds)
docker-compose ps
```

### Step 3: Run Database Migrations

```bash
# Connect to PostgreSQL and run migrations
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/001_create_users_table.sql
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/002_create_projects_table.sql
```

### Step 4: Set Up Gitea (First Time)

1. Open http://localhost:3000 in your browser
2. Complete the initial setup:
   - Database: Use existing PostgreSQL (ced/ced123)
   - Admin account: Create your admin user
   - Generate an access token for API access

### Step 5: Configure Environment Variables

Create `.env` files in each service directory:

**user-service/.env:**
```
PORT=8003
DB_HOST=localhost
DB_PORT=5432
DB_USER=ced
DB_PASSWORD=ced123
DB_NAME=ced_platform
JWT_SECRET=your-secret-key-change-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
```

**git-service/.env:**
```
PORT=8001
GITEA_URL=http://localhost:3000
GITEA_TOKEN=your-gitea-token-here
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin123
```

**alm-service/.env:**
```
PORT=8002
DB_HOST=localhost
DB_PORT=5432
DB_USER=ced
DB_PASSWORD=ced123
DB_NAME=ced_platform
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Step 6: Build and Run Go Services

**Terminal 1 - User Service:**
```bash
cd user-service
go mod tidy
go run main.go
```

**Terminal 2 - Git Service:**
```bash
cd git-service
go mod tidy
go run main.go
```

**Terminal 3 - ALM Service:**
```bash
cd alm-service
go mod tidy
go run main.go
```

### Step 7: Start Frontend

```bash
cd frontend
npm install
npm run dev
```

### Step 8: Access the Platform

- **Frontend:** http://localhost:3001 (or Next.js default port)
- **User Service:** http://localhost:8003
- **Git Service:** http://localhost:8001
- **ALM Service:** http://localhost:8002
- **Gitea:** http://localhost:3000
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin123)

## 🧪 Test the Platform

### 1. Register a User

```bash
curl -X POST http://localhost:8003/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "full_name": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:8003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

### 3. Create a Project

```bash
curl -X POST http://localhost:8002/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "My Project",
    "description": "Test project",
    "private": false,
    "owner_id": 1
  }'
```

## 🐳 Using Docker Compose (Alternative)

To run everything with Docker:

```bash
# Build and start all services
docker-compose up --build

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

## 📁 Project Structure

```
cEd/
├── user-service/     # Authentication & User Management
├── git-service/      # Git Repository Operations
├── alm-service/      # Project & Issue Management
├── frontend/         # Next.js UI
├── migrations/       # Database migrations
├── api-gateway/      # NGINX configuration
└── docker-compose.yml
```

## 🎨 Frontend Branding

The frontend uses the orange/blue color scheme:
- **Primary Blue:** #1E40AF
- **Accent Orange:** #FF6B35
- **Gradient Banners:** Orange gradient

## 🔧 Troubleshooting

### Services won't start
- Check if ports are already in use
- Verify Docker containers are running
- Check `.env` files are configured correctly

### Database connection errors
- Ensure PostgreSQL container is healthy
- Verify database credentials in `.env`
- Check migrations have been run

### Gitea integration issues
- Verify Gitea is accessible at http://localhost:3000
- Check GITEA_TOKEN is set correctly
- Ensure Gitea admin account is created

## 📚 Next Steps

1. Implement JWT middleware for protected routes
2. Add issue tracking to ALM service
3. Connect frontend to backend APIs
4. Implement repository browser UI
5. Add pull request workflow

## 🆘 Need Help?

Check the main README.md and ARCHITECTURE.md for detailed information.

