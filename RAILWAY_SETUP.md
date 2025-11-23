# Railway Deployment Guide for cEd Platform

This guide will help you deploy the cEd platform (backend + frontend) to Railway.

## Architecture

```
Railway (cEd FE + BE) <-> GitHub APIs
```

## Prerequisites

1. Railway account (sign up at https://railway.app)
2. GitHub repository connected (already done: https://github.com/phaniblend/cEd.git)
3. PostgreSQL database (Railway provides this)

## Deployment Steps

### Step 1: Create Railway Project

1. Go to https://railway.app
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Choose your repository: `phaniblend/cEd`
5. Select branch: `nodejs-monorepo`

### Step 2: Deploy Backend Service

1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → Choose `phaniblend/cEd` → Branch `nodejs-monorepo`
3. Railway will auto-detect it's a Node.js project

**Configure the service:**
- **Root Directory**: `backend`
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Step 3: Add PostgreSQL Database

1. In Railway dashboard, click "New" → "Database" → "Add PostgreSQL"
2. Railway will create a PostgreSQL database
3. Copy the connection string (you'll need it for environment variables)

### Step 4: Set Environment Variables for Backend

In the backend service settings, add these environment variables:

```
# Server
PORT=5000
NODE_ENV=production

# Database (use the connection string from Railway PostgreSQL)
DATABASE_URL=<paste-railway-postgres-connection-string>

# JWT Secret (generate a random string)
JWT_SECRET=<generate-a-random-secret-string>

# GitHub App (optional - leave empty for mock data)
GITHUB_APP_ID=
GITHUB_PRIVATE_KEY=
GITHUB_CLIENT_ID=
GITHUB_CLIENT_SECRET=
GITHUB_WEBHOOK_SECRET=
```

**To generate JWT_SECRET:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Run Database Migrations

After the backend is deployed, you need to run Prisma migrations:

1. In Railway, go to your backend service
2. Click on "Deployments" tab
3. Click on the latest deployment
4. Open the "Shell" or "Logs" tab
5. Run:
   ```bash
   cd backend
   npm run db:generate
   npm run db:push
   npm run db:seed
   ```

**OR** use Railway's one-click shell:
- Go to service → "Settings" → "Generate Domain"
- SSH into the service and run the commands above

### Step 6: Deploy Frontend Service

1. In Railway dashboard, click "New Service"
2. Select "GitHub Repo" → Choose `phaniblend/cEd` → Branch `nodejs-monorepo`
3. Configure:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run preview` (or use a static file server)

**OR** use Vercel/Netlify for frontend (recommended for React apps):
- Connect your GitHub repo
- Root directory: `frontend`
- Build command: `npm run build`
- Output directory: `dist`

### Step 7: Configure Frontend Environment

The frontend needs to know the backend URL. Update `frontend/src/api/client.ts`:

```typescript
const api = axios.create({
  baseURL: process.env.VITE_API_URL || 'https://your-backend-service.railway.app/api',
  // ...
});
```

Or set environment variable in Railway/Vercel:
- `VITE_API_URL=https://your-backend-service.railway.app/api`

### Step 8: Generate Backend Domain

1. In Railway backend service, go to "Settings"
2. Click "Generate Domain"
3. Copy the domain (e.g., `ced-backend-production.up.railway.app`)
4. Update frontend `VITE_API_URL` to use this domain

### Step 9: Update CORS in Backend

In `backend/src/index.ts`, make sure CORS allows your frontend domain:

```typescript
app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://your-frontend-domain.vercel.app',
  credentials: true
}));
```

## Environment Variables Summary

### Backend (Railway)
- `DATABASE_URL` - From Railway PostgreSQL
- `JWT_SECRET` - Random string
- `PORT` - 5000 (Railway sets this automatically)
- `NODE_ENV` - production
- `GITHUB_APP_ID` - (optional)
- `GITHUB_PRIVATE_KEY` - (optional)
- `FRONTEND_URL` - Your frontend domain

### Frontend (Vercel/Netlify or Railway)
- `VITE_API_URL` - Your backend Railway domain

## Testing Deployment

1. Backend health check: `https://your-backend.railway.app/`
2. API test: `https://your-backend.railway.app/api/projects`
3. Frontend: Visit your frontend URL

## Troubleshooting

- **Database connection issues**: Check `DATABASE_URL` format
- **Build fails**: Check Railway logs for errors
- **CORS errors**: Update `FRONTEND_URL` in backend
- **404 on API**: Check that routes are prefixed with `/api`

## Next Steps

1. Set up custom domains (optional)
2. Configure GitHub App for real GitHub integration
3. Set up monitoring and alerts
4. Configure CI/CD for automatic deployments

