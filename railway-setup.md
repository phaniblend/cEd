# Railway Deployment Guide for cEd Platform

## Quick Setup Steps

### 1. Create Railway Account
- Go to https://railway.app
- Sign up with GitHub (recommended)

### 2. Create New Project
- Click "New Project"
- Select "Deploy from GitHub repo"
- Choose your `phaniblend/cEd` repository

### 3. Add PostgreSQL Database
- In your Railway project, click "+ New"
- Select "Database" → "Add PostgreSQL"
- Railway will automatically create a PostgreSQL database
- Copy the connection details (you'll need these)

### 4. Add Redis (Optional but recommended)
- Click "+ New"
- Select "Database" → "Add Redis"
- Copy the connection details

### 5. Deploy User Service
- Click "+ New" → "GitHub Repo"
- Select your repository
- Set Root Directory: `user-service`
- Add Environment Variables:
  ```
  PORT=8003
  DB_HOST=${{Postgres.PGHOST}}
  DB_PORT=${{Postgres.PGPORT}}
  DB_USER=${{Postgres.PGUSER}}
  DB_PASSWORD=${{Postgres.PGPASSWORD}}
  DB_NAME=${{Postgres.PGDATABASE}}
  JWT_SECRET=your-secret-key-change-in-production
  REDIS_HOST=${{Redis.REDIS_HOST}}
  REDIS_PORT=${{Redis.REDIS_PORT}}
  ```
- Railway will auto-detect Go and deploy

### 6. Deploy Git Service
- Click "+ New" → "GitHub Repo"
- Select your repository
- Set Root Directory: `git-service`
- Add Environment Variables:
  ```
  PORT=8001
  GITEA_URL=your-gitea-url
  GITEA_TOKEN=your-gitea-token
  MINIO_ENDPOINT=your-minio-endpoint
  MINIO_ACCESS_KEY=your-minio-key
  MINIO_SECRET_KEY=your-minio-secret
  ```

### 7. Deploy ALM Service
- Click "+ New" → "GitHub Repo"
- Select your repository
- Set Root Directory: `alm-service`
- Add Environment Variables:
  ```
  PORT=8002
  DB_HOST=${{Postgres.PGHOST}}
  DB_PORT=${{Postgres.PGPORT}}
  DB_USER=${{Postgres.PGUSER}}
  DB_PASSWORD=${{Postgres.PGPASSWORD}}
  DB_NAME=${{Postgres.PGDATABASE}}
  JWT_SECRET=your-secret-key-change-in-production
  REDIS_HOST=${{Redis.REDIS_HOST}}
  REDIS_PORT=${{Redis.REDIS_PORT}}
  ```

### 8. Deploy Frontend
- Click "+ New" → "GitHub Repo"
- Select your repository
- Set Root Directory: `frontend`
- Add Environment Variables:
  ```
  NEXT_PUBLIC_USER_SERVICE_URL=https://your-user-service.railway.app
  NEXT_PUBLIC_ALM_SERVICE_URL=https://your-alm-service.railway.app
  NEXT_PUBLIC_GIT_SERVICE_URL=https://your-git-service.railway.app
  ```

### 9. Run Database Migrations
- Connect to your Railway PostgreSQL database
- Run the SQL files from `migrations/` folder

## Important Notes

1. **JWT_SECRET**: Use the SAME secret in both user-service and alm-service
2. **Database**: Railway provides connection strings automatically via `${{Postgres.*}}` variables
3. **Ports**: Railway assigns ports automatically, but you can set PORT env var
4. **Custom Domains**: Railway provides free `.railway.app` domains for each service

## Alternative: Use Railway's Docker Compose Support

Railway also supports docker-compose.yml files, but for microservices, deploying each service separately gives better control and scaling.

