# AI Recruitment Pipeline - Setup Script (Windows PowerShell)
# This script automates the setup process

$ErrorActionPreference = "Stop"

Write-Host "🚀 AI Recruitment Pipeline - Setup Script" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check Node.js
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js $nodeVersion detected" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed. Please install Node.js 18+ first." -ForegroundColor Red
    exit 1
}

# Check Docker
$useDocker = $false
try {
    docker --version | Out-Null
    Write-Host "✅ Docker detected - will use Docker for PostgreSQL" -ForegroundColor Green
    $useDocker = $true
} catch {
    Write-Host "⚠️  Docker not found. Make sure PostgreSQL is installed." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
Write-Host ""

# Install root dependencies
npm install

# Install backend dependencies
Set-Location backend
npm install
Set-Location ..

# Install frontend dependencies
Set-Location frontend
npm install
Set-Location ..

Write-Host ""
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Setup environment
if (-not (Test-Path .env)) {
    Write-Host "📝 Creating .env file..." -ForegroundColor Cyan
    Copy-Item .env.example .env
    Write-Host "✅ .env file created" -ForegroundColor Green
    Write-Host ""
    Write-Host "⚠️  IMPORTANT: Edit .env and add your Groq API key!" -ForegroundColor Yellow
    Write-Host "   Get free API key at: https://console.groq.com" -ForegroundColor Yellow
    Write-Host ""
    Read-Host "Press Enter to continue after editing .env"
} else {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
}

Write-Host ""
Write-Host "🗄️  Setting up database..." -ForegroundColor Cyan
Write-Host ""

if ($useDocker) {
    # Check if container already exists
    $containerExists = docker ps -a --format "{{.Names}}" | Select-String "recruitment-postgres"
    
    if ($containerExists) {
        Write-Host "⚠️  PostgreSQL container already exists" -ForegroundColor Yellow
        $response = Read-Host "Remove and recreate? (y/n)"
        if ($response -eq "y") {
            docker rm -f recruitment-postgres
            docker run -d `
              --name recruitment-postgres `
              -e POSTGRES_DB=recruitment_ai `
              -e POSTGRES_USER=postgres `
              -e POSTGRES_PASSWORD=postgres `
              -p 5432:5432 `
              postgres:15-alpine
            Write-Host "✅ PostgreSQL container created" -ForegroundColor Green
            Start-Sleep -Seconds 3
        }
    } else {
        docker run -d `
          --name recruitment-postgres `
          -e POSTGRES_DB=recruitment_ai `
          -e POSTGRES_USER=postgres `
          -e POSTGRES_PASSWORD=postgres `
          -p 5432:5432 `
          postgres:15-alpine
        Write-Host "✅ PostgreSQL container created" -ForegroundColor Green
        Start-Sleep -Seconds 3
    }
}

Write-Host ""
Write-Host "🔄 Running database migrations..." -ForegroundColor Cyan
Set-Location backend
npm run migrate
Write-Host "✅ Migrations completed" -ForegroundColor Green

Write-Host ""
Write-Host "🌱 Seeding database..." -ForegroundColor Cyan
npm run seed
Write-Host "✅ Database seeded" -ForegroundColor Green

Set-Location ..

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "✅ Setup Complete!" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "🎉 Your AI Recruitment Pipeline is ready!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the application:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Then open:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Login with:" -ForegroundColor Cyan
Write-Host "  Email:    admin@recruitment.ai" -ForegroundColor White
Write-Host "  Password: admin123" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - Quick Start: QUICKSTART.md" -ForegroundColor White
Write-Host "  - Deployment:  DEPLOYMENT.md" -ForegroundColor White
Write-Host "  - Features:    FEATURES.md" -ForegroundColor White
Write-Host "  - API Docs:    backend/API.md" -ForegroundColor White
Write-Host ""
Write-Host "Happy recruiting! 🚀" -ForegroundColor Green
