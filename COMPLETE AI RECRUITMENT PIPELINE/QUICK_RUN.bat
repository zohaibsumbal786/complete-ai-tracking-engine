@echo off
echo ========================================
echo AI Recruitment Pipeline - Quick Start
echo ========================================
echo.

echo Checking Docker...
docker --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Docker is not installed or not running
    echo Please install Docker Desktop from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

echo Docker found!
echo.

echo Starting Docker Desktop if not running...
echo Please make sure Docker Desktop is running, then press any key...
pause >nul

echo.
echo Building and starting all services...
echo This will:
echo - Start PostgreSQL database
echo - Build and start backend API
echo - Build and start frontend
echo.

docker-compose up -d --build

if errorlevel 1 (
    echo.
    echo ERROR: Failed to start services
    echo Make sure Docker Desktop is running
    pause
    exit /b 1
)

echo.
echo ========================================
echo SUCCESS! System is starting...
echo ========================================
echo.
echo Waiting for services to be ready (30 seconds)...
timeout /t 30 /nobreak >nul

echo.
echo Application is ready!
echo.
echo Frontend: http://localhost
echo Backend API: http://localhost/api
echo.
echo Login credentials:
echo   Email: admin@recruitment.ai
echo   Password: admin123
echo.
echo To view logs: docker-compose logs -f
echo To stop: docker-compose down
echo.
echo Opening browser...
start http://localhost

echo.
echo Press any key to exit...
pause >nul
