# Setup Guide

Complete setup instructions for the AI Tracking Engine.

## Prerequisites

- Node.js 18+ and npm
- Docker and Docker Compose (optional but recommended)
- Git

## Step 1: Get Free API Keys

### Together AI (Required)

1. Visit https://api.together.xyz/
2. Sign up for free account
3. Get $25 free credit
4. Navigate to Settings → API Keys
5. Create new API key
6. Save it securely

**Available Models:**
- LLM: `meta-llama/Llama-3-8b-chat-hf` (free)
- Embeddings: `togethercomputer/m2-bert-80M-8k-retrieval` (free)

### Supabase (Optional - for production)

1. Visit https://supabase.com
2. Create new project
3. Wait for database to provision
4. Go to Settings → API
5. Copy:
   - Project URL
   - Anon/Public key
6. Go to Settings → Database
7. Copy connection string

## Step 2: Clone and Install

```bash
# Clone repository
git clone <your-repo-url>
cd ai-tracking-engine

# Install all dependencies
npm run install:all
```

## Step 3: Configure Environment

```bash
# Copy example environment file
cp .env.example .env

# Edit .env file
nano .env  # or use your preferred editor
```

**Required variables:**
```env
# Together AI (Required)
TOGETHER_API_KEY=your_together_api_key_here

# Database (Use local for development)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/ai_tracking

# Vector Database
QDRANT_URL=http://localhost:6333
```

## Step 4: Start Services

### Option A: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# Check logs
docker-compose logs -f

# Stop services
docker-compose down
```

Services will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000
- PostgreSQL: localhost:5432
- Qdrant: http://localhost:6333

### Option B: Manual Setup

**Terminal 1 - Database:**
```bash
# Install PostgreSQL locally or use Docker
docker run -d \
  --name postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=ai_tracking \
  -p 5432:5432 \
  postgres:15-alpine
```

**Terminal 2 - Qdrant:**
```bash
docker run -d \
  --name qdrant \
  -p 6333:6333 \
  -p 6334:6334 \
  qdrant/qdrant:latest
```

**Terminal 3 - Backend:**
```bash
cd backend
npm install
npm run dev
```

**Terminal 4 - Frontend:**
```bash
cd frontend
npm install
npm run dev
```

## Step 5: Verify Installation

1. Open http://localhost:3000
2. You should see the AI Tracking Engine interface
3. Check backend health: http://localhost:5000/health

## Step 6: Upload Sample Documents

### Create Sample Document

Create `sample-sop.md`:
```markdown
# Employee Onboarding Process

## Day 1
- Complete HR paperwork
- Receive company laptop
- Setup email account
- Attend orientation

## Week 1
- Meet team members
- Review company policies
- Complete security training
- Setup development environment

## Contact
For questions, contact hr@company.com
```

### Upload via UI

1. Go to Query tab
2. Click upload area
3. Select `sample-sop.md`
4. Wait for processing

## Step 7: Test Query System

1. In the Query tab, ask:
   - "What happens on day 1 of onboarding?"
   - "How do I setup my development environment?"
   - "Who do I contact for HR questions?"

2. Verify:
   - Answers are relevant
   - Confidence scores are displayed
   - Sources are shown

## Step 8: Generate Analytics

```bash
# Run clustering manually
cd backend
npm run cluster:weekly
```

Then check:
- Dashboard tab for SOP updates
- Analytics tab for statistics

## Troubleshooting

### "Cannot connect to database"
```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection string
echo $DATABASE_URL
```

### "Qdrant connection failed"
```bash
# Check Qdrant is running
curl http://localhost:6333/health

# Restart Qdrant
docker restart qdrant
```

### "Together AI API error"
- Verify API key is correct
- Check you have remaining credits
- Test API key:
```bash
curl https://api.together.xyz/v1/models \
  -H "Authorization: Bearer YOUR_API_KEY"
```

### "Low confidence scores"
- Upload more comprehensive documentation
- Ensure documents are well-structured
- Add more context to questions

### "Frontend can't reach backend"
- Check backend is running on port 5000
- Verify VITE_API_URL in frontend/.env
- Check browser console for CORS errors

## Development Tips

### Hot Reload
Both frontend and backend support hot reload:
- Edit files and see changes immediately
- No need to restart services

### Database Inspection
```bash
# Connect to PostgreSQL
docker exec -it postgres psql -U postgres -d ai_tracking

# List tables
\dt

# Query data
SELECT * FROM queries LIMIT 5;
```

### Qdrant Inspection
Visit http://localhost:6333/dashboard

### View Logs
```bash
# Docker Compose
docker-compose logs -f backend
docker-compose logs -f frontend

# Manual
# Check terminal windows
```

## Next Steps

1. **Customize**: Edit prompts in `backend/src/services/rag.service.ts`
2. **Add Users**: Implement authentication
3. **Deploy**: Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
4. **Monitor**: Setup logging and alerts

## Common Commands

```bash
# Install dependencies
npm run install:all

# Start development
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run clustering
cd backend && npm run cluster:weekly

# Clean restart
docker-compose down -v
docker-compose up -d
```

## Getting Help

- Check logs first
- Review error messages
- Consult [README.md](./README.md)
- Check [DEPLOYMENT.md](./DEPLOYMENT.md)

---

Setup complete! Start asking questions about your documentation.
