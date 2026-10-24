#!/bin/bash

# AI Recruitment Pipeline - Setup Script
# This script automates the setup process

set -e

echo "🚀 AI Recruitment Pipeline - Setup Script"
echo "=========================================="
echo ""

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi

echo "✅ Node.js $(node -v) detected"

# Check PostgreSQL or Docker
if command -v psql &> /dev/null; then
    echo "✅ PostgreSQL detected"
    USE_DOCKER=false
elif command -v docker &> /dev/null; then
    echo "✅ Docker detected - will use Docker for PostgreSQL"
    USE_DOCKER=true
else
    echo "❌ Neither PostgreSQL nor Docker found. Please install one of them."
    exit 1
fi

echo ""
echo "📦 Installing dependencies..."
echo ""

# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..

echo ""
echo "✅ Dependencies installed"
echo ""

# Setup environment
if [ ! -f .env ]; then
    echo "📝 Creating .env file..."
    cp .env.example .env
    echo "✅ .env file created"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Groq API key!"
    echo "   Get free API key at: https://console.groq.com"
    echo ""
    read -p "Press Enter to continue after editing .env..."
else
    echo "✅ .env file already exists"
fi

echo ""
echo "🗄️  Setting up database..."
echo ""

if [ "$USE_DOCKER" = true ]; then
    # Check if container already exists
    if docker ps -a | grep -q recruitment-postgres; then
        echo "⚠️  PostgreSQL container already exists"
        read -p "Remove and recreate? (y/n): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            docker rm -f recruitment-postgres
            docker run -d \
              --name recruitment-postgres \
              -e POSTGRES_DB=recruitment_ai \
              -e POSTGRES_USER=postgres \
              -e POSTGRES_PASSWORD=postgres \
              -p 5432:5432 \
              postgres:15-alpine
            echo "✅ PostgreSQL container created"
            sleep 3
        fi
    else
        docker run -d \
          --name recruitment-postgres \
          -e POSTGRES_DB=recruitment_ai \
          -e POSTGRES_USER=postgres \
          -e POSTGRES_PASSWORD=postgres \
          -p 5432:5432 \
          postgres:15-alpine
        echo "✅ PostgreSQL container created"
        sleep 3
    fi
else
    # Create database using local PostgreSQL
    if psql -U postgres -lqt | cut -d \| -f 1 | grep -qw recruitment_ai; then
        echo "✅ Database 'recruitment_ai' already exists"
    else
        createdb -U postgres recruitment_ai || psql -U postgres -c "CREATE DATABASE recruitment_ai;"
        echo "✅ Database 'recruitment_ai' created"
    fi
fi

echo ""
echo "🔄 Running database migrations..."
cd backend
npm run migrate
echo "✅ Migrations completed"

echo ""
echo "🌱 Seeding database..."
npm run seed
echo "✅ Database seeded"

cd ..

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "🎉 Your AI Recruitment Pipeline is ready!"
echo ""
echo "To start the application:"
echo "  npm run dev"
echo ""
echo "Then open:"
echo "  Frontend: http://localhost:5173"
echo "  Backend:  http://localhost:3000"
echo ""
echo "Login with:"
echo "  Email:    admin@recruitment.ai"
echo "  Password: admin123"
echo ""
echo "📚 Documentation:"
echo "  - Quick Start: QUICKSTART.md"
echo "  - Deployment:  DEPLOYMENT.md"
echo "  - Features:    FEATURES.md"
echo "  - API Docs:    backend/API.md"
echo ""
echo "Happy recruiting! 🚀"
