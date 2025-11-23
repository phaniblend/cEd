# cEd Backend

Backend server for the cEd (contributeBE) platform - a GitHub-integrated developer learning and recruitment platform.

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT
- **GitHub Integration**: Octokit

## Prerequisites

- Node.js 18+ 
- PostgreSQL 14+ (or Docker)
- npm or yarn

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env` file in the `backend` directory:
   ```env
   # Server
   PORT=5000
   NODE_ENV=development

   # Database
   DATABASE_URL=postgresql://ced_user:ced_password@localhost:5432/ced?schema=public

   # JWT
   JWT_SECRET=change-me-in-production-use-a-random-string

   # GitHub App (optional for MVP - will use mock data if not set)
   GITHUB_APP_ID=
   GITHUB_PRIVATE_KEY=
   # Note: If using .env file, replace actual newlines with \n in the private key
   # Example: GITHUB_PRIVATE_KEY="-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA...\n-----END RSA PRIVATE KEY-----"
   GITHUB_CLIENT_ID=
   GITHUB_CLIENT_SECRET=
   GITHUB_WEBHOOK_SECRET=
   ```

3. **Start PostgreSQL** (using Docker):
   ```bash
   docker-compose up -d
   ```

   Or use your own PostgreSQL instance and update `DATABASE_URL` accordingly.

4. **Set up the database**:
   ```bash
   # Generate Prisma client
   npm run db:generate

   # Push schema to database
   npm run db:push

   # Seed the database with demo data
   npm run db:seed
   ```

5. **Start the development server**:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Create and run migrations
- `npm run db:seed` - Seed database with demo data
- `npm run db:studio` - Open Prisma Studio (database GUI)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user (requires auth)

### Projects
- `GET /api/projects` - List all projects (with optional filters)
- `GET /api/projects/:projectId` - Get project by ID
- `GET /api/projects/slug/:slug` - Get project by slug
- `POST /api/projects` - Create project (admin only)
- `PATCH /api/projects/:projectId` - Update project (admin only)
- `DELETE /api/projects/:projectId` - Delete project (admin only)

### Tasks
- `GET /api/tasks/projects/:projectId/tasks` - Get tasks for a project
- `GET /api/tasks/:taskId` - Get task by ID
- `POST /api/tasks/projects/:projectId/tasks` - Create task (admin only)
- `PATCH /api/tasks/:taskId` - Update task (admin only)

### Task Claims
- `GET /api/task-claims/my-claims` - Get current user's claims
- `POST /api/task-claims/tasks/:taskId/claim` - Claim a task
- `POST /api/task-claims/:claimId/submit` - Submit PR for a claim
- `PATCH /api/task-claims/:claimId/status` - Update claim status (admin only)

### Recruiter
- `GET /api/recruiter/learners` - List learners (with filters)
- `GET /api/recruiter/learners/:learnerId` - Get learner details

### GitHub Integration
- `GET /api/github/installations` - List GitHub App installations
- `GET /api/github/installations/:installationId/repos` - List repos for an installation
- `GET /api/github/repos/:owner/:repo/issues` - List issues for a repo

## Default Users (from seed)

- **Learner**: `alice@example.com` / `password123`
- **Learner**: `bob@example.com` / `password123`
- **Recruiter**: `carol@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## GitHub Integration

The GitHub integration supports both real GitHub App credentials and mock data. If `GITHUB_APP_ID` and `GITHUB_PRIVATE_KEY` are not set, the API will return mock data for development purposes.

To use real GitHub integration:
1. Create a GitHub App
2. Set the environment variables in `.env`
3. Install the app on your organization/account

## Project Structure

```
backend/
├── src/
│   ├── config/       # Configuration
│   ├── controllers/  # Route controllers
│   ├── db/          # Database client
│   ├── middlewares/ # Express middlewares
│   ├── routes/      # Route definitions
│   ├── services/    # Business logic
│   └── utils/       # Utilities
├── prisma/
│   ├── schema.prisma # Database schema
│   └── seed.ts      # Seed script
└── dist/            # Compiled output
```

