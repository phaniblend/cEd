# cEd / contributeBE

A platform that connects learners with real-world GitHub projects, helping them build verifiable portfolios while providing recruiters with a talent pipeline.

## Overview

cEd solves the "chicken-and-egg" problem for new developers:
- **Learners** get access to curated, real-world projects and build a verifiable portfolio
- **Recruiters** can search and filter candidates by tech stack, contributions, and task outcomes
- **Buyers** can browse affordable open-source apps built by the community

## Tech Stack

### Backend
- Node.js + TypeScript
- Express.js
- PostgreSQL + Prisma ORM
- JWT Authentication
- GitHub App Integration (Octokit)

### Frontend
- React 18 + TypeScript
- Vite
- TailwindCSS
- React Router
- TanStack Query

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 14+ (or Docker)
- npm or yarn

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (see `backend/.env.example`):
   ```env
   DATABASE_URL=postgresql://ced_user:ced_password@localhost:5432/ced?schema=public
   JWT_SECRET=your-secret-key-here
   PORT=5000
   ```

4. Start PostgreSQL (using Docker):
   ```bash
   docker-compose up -d
   ```

5. Set up database:
   ```bash
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

6. Start backend:
   ```bash
   npm run dev
   ```

   Backend runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start frontend:
   ```bash
   npm run dev
   ```

   Frontend runs on `http://localhost:3000`

## Default Users

After seeding the database, you can login with:

- **Learner**: `alice@example.com` / `password123`
- **Recruiter**: `carol@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

## Features

### For Learners
- Browse and search projects by tech stack
- Claim and work on tasks
- Submit pull requests
- Build a verifiable portfolio
- Get AI-powered help (placeholder)

### For Recruiters
- Search and filter learners by skills
- View learner profiles with contribution history
- Filter by minimum accepted tasks
- See detailed task outcomes and PR links

### For Buyers
- Browse featured apps
- View tech stack and maturity
- Access GitHub repositories
- Request help (placeholder)

## Project Structure

```
.
├── backend/          # Backend API server
│   ├── src/         # Source code
│   ├── prisma/      # Database schema and migrations
│   └── docker-compose.yml
├── frontend/        # Frontend React app
│   └── src/         # Source code
└── README.md
```

## Development

### Backend
- `npm run dev` - Start with hot reload
- `npm run build` - Build for production
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start dev server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## GitHub Integration

The platform integrates with GitHub Apps. For MVP, mock data is returned if GitHub credentials are not configured. To enable real GitHub integration:

1. Create a GitHub App
2. Set environment variables in `backend/.env`:
   - `GITHUB_APP_ID`
   - `GITHUB_PRIVATE_KEY` (with `\n` for newlines)
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`

## License

MIT

