#!/bin/bash

# AI Tracking Engine - Quick Setup Script
# This script automates the initial setup process

set -e

echo "🚀 AI Tracking Engine - Quick Setup"
echo "===================================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed. Please install npm first."
    exit 1
fi

if ! command -v docker &> /dev/null; then
    echo "⚠️  Docker is not installed. You'll need to setup databases manually."
    DOCKER_AVAILABLE=false
else
    DOCKER_AVAILABLE=true
fi

echo "✅ Prerequisites check complete"
echo ""

# Install dependencies
echo "📦 Installing dependencies..."
npm install
cd frontend && npm install && cd ..
cd backend && npm install && cd ..
echo "✅ Dependencies installed"
echo ""

# Setup environment
if [ ! -f .env ]; then
    echo "⚙️  Setting up environment variables..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env and add your Together AI API key"
    echo "   Get free API key at: https://api.together.xyz/"
    echo ""
    read -p "Press Enter after you've added your API key to .env..."
else
    echo "✅ .env file already exists"
fi

# Start services
if [ "$DOCKER_AVAILABLE" = true ]; then
    echo ""
    echo "🐳 Starting services with Docker Compose..."
    docker-compose up -d
    
    echo ""
    echo "⏳ Waiting for services to be ready..."
    sleep 10
    
    echo "✅ Services started"
    echo ""
    echo "📊 Service Status:"
    docker-compose ps
else
    echo ""
    echo "⚠️  Docker not available. Please start services manually:"
    echo "   1. Start PostgreSQL on port 5432"
    echo "   2. Start Qdrant on port 6333"
    echo "   3. Run: npm run dev"
fi

echo ""
echo "✅ Setup complete!"
echo ""
echo "🎉 Next steps:"
echo "   1. Open http://localhost:3000"
echo "   2. Upload sample document from sample-docs/"
echo "   3. Ask questions about your documentation"
echo ""
echo "📚 Documentation:"
echo "   - Setup Guide: SETUP.md"
echo "   - Deployment: DEPLOYMENT.md"
echo "   - Architecture: ARCHITECTURE.md"
echo ""
echo "Happy tracking! 🚀"
