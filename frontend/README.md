# cEd Frontend

Frontend application for the cEd (contributeBE) platform built with React, TypeScript, and TailwindCSS.

## Tech Stack

- **Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router
- **Data Fetching**: TanStack Query (React Query)
- **HTTP Client**: Axios

## Prerequisites

- Node.js 18+
- npm or yarn

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```

   The app will run on `http://localhost:3000`

   The Vite dev server is configured to proxy API requests to `http://localhost:5000` (backend).

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Project Structure

```
frontend/
├── src/
│   ├── api/          # API client functions
│   ├── components/   # Reusable components
│   ├── hooks/        # Custom React hooks
│   ├── pages/        # Page components
│   │   ├── auth/     # Authentication pages
│   │   ├── learner/  # Learner-specific pages
│   │   ├── recruiter/# Recruiter-specific pages
│   │   └── apps/     # App catalog pages
│   ├── types/        # TypeScript type definitions
│   └── utils/        # Utility functions
├── public/           # Static assets
└── dist/             # Production build output
```

## Pages

- `/` - Landing page
- `/auth/login` - Login page
- `/auth/register` - Registration page
- `/projects` - All projects listing
- `/learner/dashboard` - Learner dashboard
- `/learner/projects/:projectId` - Project detail page
- `/learner/tasks/:taskId` - Task workbench
- `/recruiter/dashboard` - Recruiter talent explorer
- `/recruiter/learners/:learnerId` - Learner profile
- `/apps` - App catalog
- `/apps/:slug` - App detail page

## Authentication

The app uses JWT tokens stored in localStorage. The token is automatically included in API requests via axios interceptors.

## Environment Variables

No environment variables are required for the frontend in development. The API base URL is configured in `src/api/client.ts` and defaults to `/api` (proxied to backend in development).

