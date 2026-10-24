# Quick Start Guide

Get the AI Recruitment Pipeline running in 5 minutes!

## Prerequisites

- Node.js 18+ installed
- PostgreSQL 14+ installed (or Docker)
- Groq API key (free at https://console.groq.com)

## Step 1: Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-recruitment-pipeline

# Install all dependencies
npm run install:all
```

## Step 2: Setup Environment

```bash
# Copy environment template
cp .env.example .env
```

Edit `.env` and add your Groq API key:
```env
GROQ_API_KEY=your-groq-api-key-here
```

## Step 3: Setup Database

### Option A: Using Docker (Recommended)

```bash
docker run -d \
  --name recruitment-postgres \
  -e POSTGRES_DB=recruitment_ai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

### Option B: Using Local PostgreSQL

```bash
# Create database
createdb recruitment_ai

# Or using psql
psql -U postgres -c "CREATE DATABASE recruitment_ai;"
```

## Step 4: Initialize Database

```bash
cd backend

# Run migrations
npm run migrate

# Seed sample data
npm run seed
```

## Step 5: Start Application

```bash
# From project root
npm run dev
```

This starts both backend and frontend servers.

## Step 6: Access Application

Open your browser:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

**Login with:**
- Email: `admin@recruitment.ai`
- Password: `admin123`

## What's Next?

1. **Upload a CV**: Go to Candidates → Upload CV
2. **Create a Job**: Go to Jobs → Create Job
3. **Generate Questions**: Select a job → Generate Screening Questions
4. **Schedule Interview**: Go to Interviews → Schedule Interview
5. **View Analytics**: Check the Dashboard for insights

## Troubleshooting

### Port Already in Use

```bash
# Kill process on port 3000
npx kill-port 3000

# Kill process on port 5173
npx kill-port 5173
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or for local PostgreSQL
pg_isready
```

### AI Service Error

- Verify your Groq API key is correct
- Check you have internet connection
- Groq free tier has rate limits

## Docker Quick Start

If you prefer Docker:

```bash
# Start everything with one command
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Access at http://localhost

## Need Help?

- Check [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed setup
- See [API.md](./backend/API.md) for API documentation
- Review [ENV.md](./ENV.md) for environment variables

## Features to Try

✅ Upload and parse CVs with AI  
✅ Auto-generate screening questions  
✅ Schedule interviews with email invites  
✅ Track candidates through pipeline  
✅ View real-time analytics  
✅ Bias-free candidate screening  

Enjoy your AI-powered recruitment system! 🚀
