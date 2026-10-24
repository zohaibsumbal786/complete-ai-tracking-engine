@echo off
REM AI Tracking Engine - Quick Setup Script for Windows
REM This script automates the initial setup process

echo ========================================
echo AI Tracking Engine - Quick Setup
echo ========================================
echo.

REM Check Node.js
echo Checking prerequisites...
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Node.js is not installed. Please install Node.js 18+ first.
    exit /b 1
)

where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] npm is not installed. Please install npm first.
    exit /b 1
)

where docker >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo [WARNING] Docker is not installed. You'll need to setup databases manually.
    set DOCKER_AVAILABLE=false
) else (
    set DOCKER_AVAILABLE=true
)

echo [OK] Prerequisites check complete
echo.

REM Install dependencies
echo Installing dependencies...
call npm install
cd frontend
call npm install
cd ..
cd backend
call npm install
cd ..
echo [OK] Dependencies installed
echo.

REM Setup environment
if not exist .env (
    echo Setting up environment variables...
    copy .env.example .env
    echo [OK] Created .env file
    echo.
    echo [IMPORTANT] Edit .env and add your Together AI API key
    echo Get free API key at: https://api.together.xyz/
    echo.
    pause
) else (
    echo [OK] .env file already exists
)

REM Start services
if "%DOCKER_AVAILABLE%"=="true" (
    echo.
    echo Starting services with Docker Compose...
    docker-compose up -d
    
    echo.
    echo Waiting for services to be ready...
    timeout /t 10 /nobreak >nul
    
    echo [OK] Services started
    echo.
    echo Service Status:
    docker-compose ps
) else (
    echo.
    echo [WARNING] Docker not available. Please start services manually:
    echo   1. Start PostgreSQL on port 5432
    echo   2. Start Qdrant on port 6333
    echo   3. Run: npm run dev
)

echo.
echo ========================================
echo Setup complete!
echo ========================================
echo.
echo Next steps:
echo   1. Open http://localhost:3000
echo   2. Upload sample document from sample-docs/
echo   3. Ask questions about your documentation
echo.
echo Documentation:
echo   - Setup Guide: SETUP.md
echo   - Deployment: DEPLOYMENT.md
echo   - Architecture: ARCHITECTURE.md
echo.
echo Happy tracking!
pause
