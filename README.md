# cEd Platform

**SCM + ALM = Custom Platform (Built with Go + Open Source)**

**AI + Monaco = Editor**

**(ALM+SCM) FE + Editor = UI**

**UI <=> Custom Platform = cEd**

## Architecture

cEd is a modern ALM (Application Lifecycle Management) + SCM (Source Control Management) platform built with Go microservices and a React/Next.js frontend.

### Services

- **User Service** (Port 8003) - Authentication, Users, Organizations, Permissions
- **Git Service** (Port 8001) - Repository operations, Git protocol (via Gitea)
- **ALM Service** (Port 8002) - Issues, Pull Requests, Projects
- **API Gateway** (Port 8080) - Routing, rate limiting, CORS

### Technology Stack

**Backend:**
- Go 1.21+
- Fiber v2.52.0
- go-git/v5 v5.11.0
- PostgreSQL 15+
- Redis 7+
- MinIO (S3-compatible)

**Frontend:**
- Next.js 16
- React 19
- Tailwind CSS 4
- TypeScript

**Infrastructure:**
- Gitea (headless SCM engine)
- Docker & Docker Compose

## Quick Start

### Prerequisites

- Go 1.21+
- Docker & Docker Compose
- Node.js 18+ (for frontend)

### Development Setup

1. **Start infrastructure services:**
   ```bash
   docker-compose up -d postgres redis minio gitea
   ```

2. **Build Go services:**
   ```bash
   make build
   ```

3. **Run services:**
   ```bash
   # User Service
   cd user-service && go run main.go

   # Git Service
   cd git-service && go run main.go

   # ALM Service
   cd alm-service && go run main.go
   ```

4. **Start frontend:**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### Using Docker Compose

```bash
# Start all services
make up

# View logs
make logs

# Stop all services
make down
```

## Project Structure

```
cEd/
├── git-service/          # Git repository operations
├── alm-service/          # Issues, PRs, Projects
├── user-service/         # Authentication, Users, Orgs
├── shared/               # Shared models and utilities
├── migrations/           # Database migrations
├── frontend/             # Next.js frontend
├── docker-compose.yml    # Development environment
└── Makefile             # Common tasks
```

## Environment Variables

Create `.env` files in each service directory:

**user-service/.env:**
```
PORT=8003
DB_HOST=localhost
DB_PORT=5432
DB_USER=ced
DB_PASSWORD=ced123
DB_NAME=ced_platform
JWT_SECRET=your-secret-key
REDIS_HOST=localhost
REDIS_PORT=6379
```

**git-service/.env:**
```
PORT=8001
GITEA_URL=http://localhost:3000
GITEA_TOKEN=your-gitea-token
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

## API Endpoints

### User Service (8003)
- `POST /api/v1/auth/register` - Register new user
- `POST /api/v1/auth/login` - User login
- `GET /health` - Health check

### Git Service (8001)
- `POST /api/v1/repos` - Create repository
- `GET /api/v1/repos/:owner/:name` - Get repository
- `GET /api/v1/repos/:owner/:name/branches` - List branches
- `GET /health` - Health check

### ALM Service (8002)
- `GET /health` - Health check

## Development Roadmap

- [x] Project structure setup
- [x] User Service foundation
- [x] Git Service foundation
- [x] ALM Service foundation
- [x] Frontend branding
- [ ] User authentication implementation
- [ ] Repository management
- [ ] Issue tracking
- [ ] Pull request workflow
- [ ] Code review interface
- [ ] Search functionality
- [ ] Notifications

## License

MIT

