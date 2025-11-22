# cEd Platform - Testing Guide

## Prerequisites

1. **Start Infrastructure Services:**
   ```bash
   docker-compose up -d postgres redis minio gitea
   ```

2. **Run Database Migrations:**
   ```bash
   # Windows PowerShell
   Get-Content migrations/001_create_users_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
   Get-Content migrations/002_create_projects_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
   Get-Content migrations/003_create_issues_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
   Get-Content migrations/004_create_pull_requests_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
   
   # Linux/Mac
   docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/001_create_users_table.sql
   docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/002_create_projects_table.sql
   docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/003_create_issues_table.sql
   docker exec -i ced-postgres psql -U ced -d ced_platform < migrations/004_create_pull_requests_table.sql
   ```

3. **Configure Gitea:**
   - Open http://localhost:3000
   - Complete initial setup
   - Create an admin user
   - Generate an access token (Settings → Applications → Generate New Token)
   - Update `git-service/.env` with the token

4. **Create .env Files:**

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

## Starting Services

### Terminal 1 - User Service
```bash
cd user-service
go run main.go
```

### Terminal 2 - Git Service
```bash
cd git-service
go run main.go
```

### Terminal 3 - ALM Service
```bash
cd alm-service
go run main.go
```

### Terminal 4 - Frontend
```bash
cd frontend
npm install
npm run dev
```

## Testing the Platform

### 1. Test User Registration

**Via Frontend:**
1. Open http://localhost:3000 (or Next.js default port)
2. Click "Create an account"
3. Fill in the registration form
4. Submit and verify redirect to dashboard

**Via API:**
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

### 2. Test User Login

**Via Frontend:**
1. Go to login page
2. Enter credentials
3. Verify redirect to dashboard

**Via API:**
```bash
curl -X POST http://localhost:8003/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

Save the token from the response for subsequent requests.

### 3. Test Project Creation

**Via Frontend:**
1. Login to the platform
2. Click "Create New Project" from dashboard
3. Fill in project details
4. Submit and verify project appears in projects list

**Via API:**
```bash
TOKEN="your-jwt-token-here"

curl -X POST http://localhost:8002/api/v1/projects \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "Test Project",
    "description": "A test project",
    "private": false,
    "owner_id": 1
  }'
```

### 4. Test Issue Creation

**Via Frontend:**
1. Navigate to a project
2. Go to Issues tab
3. Click "New Issue"
4. Fill in issue details
5. Submit and verify issue appears

**Via API:**
```bash
curl -X POST http://localhost:8002/api/v1/issues \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "project_id": 1,
    "title": "Test Issue",
    "description": "This is a test issue",
    "status": "open"
  }'
```

### 5. Test Issue Status Update

**Via Frontend:**
1. Go to Issues page
2. Drag an issue from one column to another in Kanban view
3. Verify status updates

**Via API:**
```bash
curl -X PATCH http://localhost:8002/api/v1/issues/1/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "status": "in_progress"
  }'
```

### 6. Test Repository Creation

**Via API:**
```bash
curl -X POST http://localhost:8001/api/v1/repos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "name": "test-repo",
    "owner": "testuser",
    "private": false
  }'
```

### 7. Test Health Checks

```bash
# User Service
curl http://localhost:8003/health

# Git Service
curl http://localhost:8001/health

# ALM Service
curl http://localhost:8002/health
```

## Expected Behavior

### Authentication Flow
- ✅ User can register with email, username, password, full name
- ✅ User receives JWT token on successful registration/login
- ✅ Token is stored in localStorage
- ✅ Protected routes require valid token

### Project Management
- ✅ User can create projects
- ✅ Projects list shows user's projects
- ✅ Project details page displays project information
- ✅ Projects can be public or private

### Issue Management
- ✅ Issues can be created for a project
- ✅ Issues can be listed by project
- ✅ Issue status can be updated (open, in_progress, closed)
- ✅ Kanban board displays issues by status
- ✅ Issues can be dragged between columns

### UI/UX
- ✅ Orange/Blue branding throughout
- ✅ Responsive design
- ✅ Loading states
- ✅ Error messages
- ✅ Smooth transitions

## Troubleshooting

### Services won't start
- Check if ports are already in use
- Verify Docker containers are running: `docker-compose ps`
- Check `.env` files are configured correctly

### Database connection errors
- Ensure PostgreSQL container is healthy: `docker ps`
- Verify database credentials in `.env`
- Check migrations have been run

### Authentication fails
- Verify JWT_SECRET is the same in user-service and alm-service
- Check token is being sent in Authorization header
- Verify token hasn't expired (24 hours)

### CORS errors
- Services have CORS enabled for all origins in development
- Check browser console for specific CORS errors

### Frontend can't connect to backend
- Verify services are running on correct ports
- Check API URLs in `frontend/lib/api.ts`
- Verify no firewall blocking connections

## Next Steps for Production

1. **Security:**
   - Use environment-specific JWT secrets
   - Implement rate limiting
   - Add input validation
   - Sanitize user inputs

2. **Performance:**
   - Add database connection pooling
   - Implement caching strategy
   - Add pagination to list endpoints
   - Optimize database queries

3. **Monitoring:**
   - Add logging
   - Set up health check endpoints
   - Implement error tracking
   - Add metrics collection

4. **Testing:**
   - Write unit tests
   - Add integration tests
   - Implement E2E tests
   - Set up CI/CD pipeline

