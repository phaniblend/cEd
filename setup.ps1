# cEd Platform Setup Script for Windows

Write-Host "🚀 Setting up cEd Platform..." -ForegroundColor Cyan

# Check prerequisites
Write-Host "📋 Checking prerequisites..." -ForegroundColor Yellow
$prereqs = @("docker", "docker-compose", "go", "node")
foreach ($cmd in $prereqs) {
    if (-not (Get-Command $cmd -ErrorAction SilentlyContinue)) {
        Write-Host "❌ $cmd is required but not installed. Aborting." -ForegroundColor Red
        exit 1
    }
}

Write-Host "✅ All prerequisites met!" -ForegroundColor Green

# Start infrastructure
Write-Host "🐳 Starting infrastructure services..." -ForegroundColor Yellow
docker-compose up -d postgres redis minio gitea

Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Run database migrations
Write-Host "📊 Running database migrations..." -ForegroundColor Yellow
Get-Content migrations/001_create_users_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/002_create_projects_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/003_create_issues_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform
Get-Content migrations/004_create_pull_requests_table.sql | docker exec -i ced-postgres psql -U ced -d ced_platform

Write-Host "✅ Database migrations completed!" -ForegroundColor Green

# Build Go services
Write-Host "🔨 Building Go services..." -ForegroundColor Yellow
Set-Location user-service; go mod tidy; Set-Location ..
Set-Location git-service; go mod tidy; Set-Location ..
Set-Location alm-service; go mod tidy; Set-Location ..

Write-Host "✅ Go services built!" -ForegroundColor Green

# Install frontend dependencies
Write-Host "📦 Installing frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend; npm install; Set-Location ..

Write-Host "✅ Frontend dependencies installed!" -ForegroundColor Green

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1. Configure Gitea at http://localhost:3000"
Write-Host "2. Create .env files in each service directory"
Write-Host "3. Start services:"
Write-Host "   - User Service: cd user-service; go run main.go"
Write-Host "   - Git Service: cd git-service; go run main.go"
Write-Host "   - ALM Service: cd alm-service; go run main.go"
Write-Host "   - Frontend: cd frontend; npm run dev"
Write-Host ""
Write-Host "Or use docker-compose: docker-compose up --build"

