# 🚀 Quick Start - cEd Platform

## One-Command Setup (Windows)

```powershell
.\setup.ps1
```

## One-Command Setup (Linux/Mac)

```bash
chmod +x setup.sh
./setup.sh
```

## Manual Setup

### 1. Start Infrastructure (5 minutes)

```bash
docker-compose up -d postgres redis minio gitea
```

Wait 30 seconds for services to be ready.

### 2. Run Migrations

**Windows:**
```powershell
Get-Content migrations/001_create_users_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/002_create_projects_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/003_create_issues_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/004_create_pull_requests_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
```

**Linux/Mac:**
```bash
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/001_create_users_table.sql
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/002_create_projects_table.sql
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/003_create_issues_table.sql
docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/004_create_pull_requests_table.sql
```

### 3. Configure Gitea

1. Open http://localhost:3000
2. Complete setup wizard
3. Create admin account
4. Go to Settings → Applications → Generate New Token
5. Copy the token

### 4. Create Environment Files

Copy these to each service directory:

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
JWT_SECRET=your-secret-key-change-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
```

**Important:** Use the same `JWT_SECRET` in user-service and alm-service!

### 5. Start Services

Open 4 terminals:

**Terminal 1 - User Service:**
```bash
cd user-service
go run main.go
```

**Terminal 2 - Git Service:**
```bash
cd git-service
go run main.go
```

**Terminal 3 - ALM Service:**
```bash
cd alm-service
go run main.go
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### 6. Access the Platform

- **Frontend:** http://localhost:3000 (or Next.js default port)
- **User Service:** http://localhost:8003
- **Git Service:** http://localhost:8001
- **ALM Service:** http://localhost:8002
- **Gitea:** http://localhost:3000 (if not using Next.js default)
- **MinIO Console:** http://localhost:9001 (minioadmin/minioadmin123)

## First Steps

1. **Register a user** at the registration page
2. **Login** with your credentials
3. **Create a project** from the dashboard
4. **Add issues** to your project
5. **Try the Kanban board** to manage issues

## Verify Everything Works

```bash
# Health checks
curl http://localhost:8003/health  # User Service
curl http://localhost:8001/health  # Git Service
curl http://localhost:8002/health  # ALM Service
```

All should return `{"status":"ok","service":"..."}`

## Need Help?

- Check `TESTING.md` for detailed testing instructions
- Check `QUICKSTART.md` for more details
- Check `ARCHITECTURE.md` for system design
- Check `PROGRESS.md` for development status

## Common Issues

**Port already in use:**
- Stop the service using that port
- Or change the PORT in .env file

**Database connection failed:**
- Verify PostgreSQL is running: `docker ps`
- Check credentials in .env match docker-compose.yml

**JWT authentication fails:**
- Ensure JWT_SECRET is identical in user-service and alm-service
- Check token is being sent in Authorization header

**Frontend can't connect:**
- Verify all backend services are running
- Check browser console for errors
- Verify API URLs in frontend/lib/api.ts

---

**Ready to build! 🎉**

