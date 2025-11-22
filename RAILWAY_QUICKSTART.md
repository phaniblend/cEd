# 🚂 Railway Quick Start - cEd Platform

## Step-by-Step Railway Deployment

### Step 1: Push to GitHub (Do this first)
```powershell
cd E:\cEd
git push -u origin main
```
(You'll need to authenticate - use GitHub Personal Access Token)

### Step 2: Create Railway Account
1. Go to https://railway.app
2. Click "Start a New Project"
3. Sign in with GitHub

### Step 3: Create Project from GitHub
1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `phaniblend/cEd`
4. Click "Deploy"

### Step 4: Add PostgreSQL Database
1. In your Railway project, click "+ New"
2. Select "Database" → "Add PostgreSQL"
3. Wait for it to provision
4. Click on the PostgreSQL service
5. Go to "Variables" tab
6. Note the connection variables (we'll use these)

### Step 5: Deploy User Service
1. Click "+ New" → "GitHub Repo"
2. Select `phaniblend/cEd`
3. Click "Add Service"
4. In the service settings:
   - **Root Directory**: `user-service`
   - **Build Command**: (leave empty, auto-detected)
   - **Start Command**: (leave empty, auto-detected)
5. Go to "Variables" tab, add:
   ```
   PORT=8003
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   JWT_SECRET=ced-secret-key-2025-change-in-production
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
6. Click "Deploy"

### Step 6: Deploy ALM Service
1. Click "+ New" → "GitHub Repo"
2. Select `phaniblend/cEd`
3. In service settings:
   - **Root Directory**: `alm-service`
4. Go to "Variables" tab, add:
   ```
   PORT=8002
   DB_HOST=${{Postgres.PGHOST}}
   DB_PORT=${{Postgres.PGPORT}}
   DB_USER=${{Postgres.PGUSER}}
   DB_PASSWORD=${{Postgres.PGPASSWORD}}
   DB_NAME=${{Postgres.PGDATABASE}}
   JWT_SECRET=ced-secret-key-2025-change-in-production
   REDIS_HOST=localhost
   REDIS_PORT=6379
   ```
5. Click "Deploy"

### Step 7: Deploy Git Service
1. Click "+ New" → "GitHub Repo"
2. Select `phaniblend/cEd`
3. In service settings:
   - **Root Directory**: `git-service`
4. Go to "Variables" tab, add:
   ```
   PORT=8001
   GITEA_URL=http://localhost:3000
   GITEA_TOKEN=592f9608edb759d3817d0fdfa8bc66537f98fa0a
   MINIO_ENDPOINT=localhost:9000
   MINIO_ACCESS_KEY=minioadmin
   MINIO_SECRET_KEY=minioadmin123
   ```
5. Click "Deploy"

### Step 8: Deploy Frontend
1. Click "+ New" → "GitHub Repo"
2. Select `phaniblend/cEd`
3. In service settings:
   - **Root Directory**: `frontend`
4. Go to "Variables" tab, add:
   ```
   NEXT_PUBLIC_USER_SERVICE_URL=${{UserService.RAILWAY_PUBLIC_DOMAIN}}
   NEXT_PUBLIC_ALM_SERVICE_URL=${{AlmService.RAILWAY_PUBLIC_DOMAIN}}
   NEXT_PUBLIC_GIT_SERVICE_URL=${{GitService.RAILWAY_PUBLIC_DOMAIN}}
   ```
   (Replace with actual Railway URLs after services deploy)
5. Click "Deploy"

### Step 9: Run Database Migrations
1. Click on your PostgreSQL service
2. Go to "Connect" tab
3. Copy the connection string
4. Use Railway's PostgreSQL CLI or connect via a database tool
5. Run the SQL files from `migrations/` folder

### Step 10: Get Your URLs
- Each service gets a `.railway.app` URL automatically
- Find them in each service's "Settings" → "Networking"
- Update frontend environment variables with these URLs

## 🎉 Done!
Your cEd platform is now live on Railway!

