# cEd Platform Architecture

## Core Principle

```
SCM + ALM = Custom Platform (Built with Go + Open Source)

AI + Monaco = Editor

(ALM+SCM) FE + Editor = UI

UI <=> Custom Platform = cEd
```

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend Layer (cEd UI)                   │
│         (React/Vue/Svelte - Custom Branded UI)               │
│    - Repository Browser  - Issue Tracker  - PR Review        │
└─────────────────────────────────────────────────────────────┘
                             │
                    ┌────────┴────────┐
                    │   API Gateway   │
                    │   (NGINX)       │
                    └────────┬────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  Git Service   │  │   ALM Service   │  │  User Service  │
│   (Port 8001)  │  │   (Port 8002)   │  │  (Port 8003)   │
└───────┬────────┘  └────────┬────────┘  └───────┬────────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
┌───────▼────────┐  ┌────────▼────────┐  ┌───────▼────────┐
│  PostgreSQL    │  │     Redis       │  │   MinIO/S3     │
│   (Primary)    │  │   (Cache/Queue) │  │  (Git Storage) │
└────────────────┘  └─────────────────┘  └────────────────┘
                             │
                    ┌────────┴────────┐
                    │     Gitea       │
                    │  (Headless SCM) │
                    └─────────────────┘
```

## Service Breakdown

| Service | Responsibility | Port | Tech Stack |
|---------|---------------|------|------------|
| **Git Service** | Repository operations, Git protocol | 8001 | Go + go-git + Gitea API |
| **ALM Service** | Issues, PRs, Projects | 8002 | Go + Fiber |
| **User Service** | Auth, Users, Orgs, Permissions | 8003 | Go + JWT |
| **Search Service** | Code & issue search | 8004 | Go + Bleve |
| **Notification Service** | Email, webhooks, events | 8005 | Go + Redis Streams |
| **API Gateway** | Routing, rate limiting, CORS | 8080 | NGINX |

## Technology Stack

**Backend Services:**
- Language: Go 1.21+
- HTTP framework: Fiber v2.52.0
- Git operations: go-git/v5 v5.11.0 + Gitea API
- Database: PostgreSQL 15+ with lib/pq
- Cache/queue: Redis 7+
- Storage: MinIO (S3-compatible)
- Search: Bleve v2.3.10
- Auth: JWT v5.2.0

**Infrastructure:**
- Database: PostgreSQL 15+
- Cache/queue: Redis 7+
- Object storage: MinIO (S3-compatible)
- Search: Bleve (embedded) or Elasticsearch (optional)
- API gateway: NGINX
- SCM Engine: Gitea (headless)
- Monitoring: Prometheus + Grafana (optional)
- Logging: ELK Stack or Loki (optional)

## Design Decisions

1. **Microservices Architecture** — Independent, scalable services
2. **API-first Design** — Decoupled frontend and backend
3. **Open Source Components** — go-git, Fiber, Gitea, etc.
4. **Cloud-native** — Containerized, scalable, cloud-agnostic
5. **Extensible** — Plugin/webhook architecture
6. **Gitea Integration** — Headless SCM engine, all operations via API

## Project Structure

```
cEd/
├── git-service/          # Git repository operations
│   ├── internal/
│   │   └── gitea/       # Gitea API client
│   ├── handlers/        # HTTP handlers
│   └── main.go
├── alm-service/          # Issues, PRs, Projects
│   ├── handlers/
│   ├── models/
│   └── main.go
├── user-service/         # Authentication, Users, Orgs
│   ├── handlers/
│   ├── models/
│   ├── database/
│   └── main.go
├── shared/               # Shared models and utilities
├── migrations/           # Database migrations
├── api-gateway/          # NGINX configuration
├── frontend/             # Next.js frontend
├── docker-compose.yml    # Development environment
└── Makefile             # Common tasks
```

## Gitea Integration Strategy

Gitea runs as a headless SCM engine. All Git operations are proxied through the Git Service:

1. **Git Service** → **Gitea API** → **Gitea DB**
2. Frontend never directly accesses Gitea
3. All Gitea URLs are rewritten internally
4. No Gitea UI or branding is exposed

## Development Roadmap

### Phase 1: Foundation ✅
- [x] Project structure setup
- [x] User Service implementation
- [x] Git Service (basic) implementation
- [x] ALM Service foundation
- [x] Frontend branding

### Phase 2: ALM Core
- [ ] Issue Tracking
- [ ] Pull Requests
- [ ] Code Review

### Phase 3: Advanced Features
- [ ] Organizations & Teams
- [ ] Search & Notifications
- [ ] Advanced Git features

### Phase 4: Production Deployment
- [ ] Infrastructure setup
- [ ] Testing
- [ ] Launch

