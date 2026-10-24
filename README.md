# 🎯 AI Tracking Engine

> Transform your company documentation into a continuous improvement system with AI-powered question tracking, gap detection, and automated prioritization.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)

## ✨ Features

- **🤖 RAG Query System**: Ask questions about company SOPs with confidence-scored answers
- **📊 Smart Analytics**: Automatic weekly clustering of similar questions
- **🔍 Gap Detection**: AI identifies documentation that needs updates
- **📋 Kanban Dashboard**: Visual workflow for managing SOP updates
- **💰 100% Free Tier**: Runs entirely on free services
- **🚀 Production Ready**: Deploy in minutes, not days

## 🎬 Demo

### Query Interface
Ask questions and get AI-powered answers with confidence scores:
```
Q: "What are the working hours?"
A: "Standard hours are 9:00 AM - 5:00 PM..." 
Confidence: 87.3% ✅
```

### Dashboard
Drag-and-drop Kanban board for managing documentation updates:
```
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ To Update   │ In Progress │ In Review   │    Done     │
├─────────────┼─────────────┼─────────────┼─────────────┤
│ 🔴 HIGH     │ 🟡 MEDIUM   │ 🟡 MEDIUM   │ ⚪ LOW      │
│ Leave Policy│ IT Security │ Expenses    │ Onboarding  │
│ 15 questions│ 8 questions │ 5 questions │ 3 questions │
│ 62% conf.   │ 71% conf.   │ 78% conf.   │ 89% conf.   │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Analytics
Track trends and identify patterns:
- 📈 Weekly query volume
- 📊 Confidence trends
- 🎯 Automated insights

## 🚀 Quick Start (< 30 minutes)

### Prerequisites
- Node.js 18+ and npm
- Docker & Docker Compose (optional, for easy setup)
- Free API keys (setup below)

### 1. Get Free API Keys

#### Together AI (Free $25 credit)
1. Visit https://api.together.xyz/
2. Sign up and get API key
3. Free models: Llama-3, embeddings

#### Supabase (Free PostgreSQL + Auth)
1. Visit https://supabase.com
2. Create new project
3. Get URL and anon key from Settings > API

### 2. Installation

```bash
# Clone and setup
git clone <your-repo>
cd ai-tracking-engine

# Install dependencies
npm run install:all

# Setup environment variables
cp .env.example .env
# Edit .env with your API keys

# Start with Docker (recommended)
docker-compose up

# OR start manually
npm run dev
```

### 3. Access Application
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- Upload sample docs and start asking questions!

## 🏗️ Architecture

```
┌─────────────┐      ┌──────────────┐      ┌─────────────┐
│   React UI  │─────▶│  Express API │─────▶│  Supabase   │
│  (Frontend) │      │   (Backend)  │      │ (PostgreSQL)│
└─────────────┘      └──────────────┘      └─────────────┘
                            │
                            ├─────▶ Together AI (LLM + Embeddings)
                            │
                            └─────▶ Qdrant (Vector Search)
```

## 📊 Confidence Score Algorithm

```javascript
confidence = (
  0.4 * max_chunk_similarity +      // Best matching document chunk
  0.3 * avg_top3_similarity +       // Average of top 3 chunks
  0.3 * llm_confidence              // LLM self-assessment
) * 100
```

## 🔧 Tech Stack

### Frontend
- React 18 + TypeScript
- Tailwind CSS
- @dnd-kit/core (drag-and-drop)
- Lucide React (icons)
- Recharts (analytics)

### Backend
- Node.js + Express
- PostgreSQL (Supabase)
- Qdrant (vector database)
- Together AI (LLM + embeddings)

### Free Hosting Options
- **Frontend**: Vercel / Netlify
- **Backend**: Railway / Render
- **Database**: Supabase (free tier)
- **Vector DB**: Qdrant Cloud (1GB free)

## 📁 Project Structure

```
ai-tracking-engine/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Dashboard/
│   │   │   ├── QueryInterface/
│   │   │   └── Analytics/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── types/
│   └── package.json
├── backend/
│   ├── src/
│   │   ├── routes/
│   │   ├── services/
│   │   │   ├── rag.service.ts
│   │   │   ├── clustering.service.ts
│   │   │   └── analytics.service.ts
│   │   ├── jobs/
│   │   └── utils/
│   └── package.json
├── docker-compose.yml
└── README.md
```

## 🎯 Usage

### 1. Upload Documentation
- Navigate to Settings > Documents
- Upload PDF or Markdown files
- System automatically chunks and indexes content

### 2. Ask Questions
- Use the query interface
- Get AI-powered answers with confidence scores
- Low confidence (<70%) automatically flagged

### 3. Review Analytics
- Weekly reports show question clusters
- Identify trending topics
- See documentation gaps

### 4. Manage Updates
- Drag cards through Kanban workflow
- Assign team members
- Track completion

## 🔐 Environment Variables

```env
# Backend
PORT=5000
DATABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
TOGETHER_API_KEY=your_together_api_key
QDRANT_URL=http://localhost:6333

# Frontend
VITE_API_URL=http://localhost:5000
```

## 📈 Deployment

### Deploy to Vercel + Railway (Free)

```bash
# Frontend to Vercel
cd frontend
vercel deploy

# Backend to Railway
cd backend
railway up
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

```bash
# Run all tests
npm test

# Frontend tests
cd frontend && npm test

# Backend tests
cd backend && npm test
```

## 🤝 Contributing

Contributions welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) first.

## 📄 License

MIT License - see [LICENSE](./LICENSE)

## 🆘 Support

- Documentation: [docs/](./docs/)
- Issues: GitHub Issues
- Discussions: GitHub Discussions

---

Built with ❤️ for continuous documentation improvement
