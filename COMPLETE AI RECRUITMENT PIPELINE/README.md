# 🚀 AI Recruitment Pipeline System

A complete, production-ready AI recruitment automation platform with **100% free** API dependencies. Built with modern technologies and best practices for scalable, bias-free hiring.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)
![React](https://img.shields.io/badge/React-18.2-61dafb.svg)

## ✨ Features

### Core Capabilities
- 🤖 **AI-Powered CV Parsing** - Automatically extract structured data from resumes
- 📝 **Smart Screening Questions** - AI generates relevant questions based on job requirements
- 📅 **Interview Scheduling** - Automated scheduling with calendar sync and email invites
- 📊 **Real-Time Analytics** - Comprehensive dashboard with hiring insights
- 🎯 **Bias-Free Screening** - Remove identifying information for fair evaluation
- 🔗 **Integrations** - Google Calendar, Gmail SMTP, and more
- 🐳 **Docker Ready** - One-command deployment with Docker Compose

### Technical Highlights
- ⚡ Fast AI inference with Groq (Llama 3.1 70B)
- 🔒 Secure JWT authentication
- 📱 Responsive design with Tailwind CSS
- 🔄 Real-time updates with React Query
- 📧 Automated email notifications
- 📈 Advanced analytics and reporting
- 🔍 Full-text search capabilities
- 📋 Audit trail for compliance

## 🛠️ Tech Stack

### Frontend
- **React 18** + **TypeScript** - Modern UI development
- **Tailwind CSS** - Utility-first styling
- **Vite** - Lightning-fast build tool
- **TanStack Query** - Powerful data fetching
- **Zustand** - Lightweight state management
- **Recharts** - Beautiful data visualization

### Backend
- **Node.js 18** + **Express** - Robust API server
- **TypeScript** - Type-safe development
- **PostgreSQL** - Reliable relational database
- **JWT** - Secure authentication
- **Multer** - File upload handling
- **Nodemailer** - Email automation

### AI/ML
- **Groq API** - Fast LLM inference (free tier)
- **Ollama** - Local AI option (100% free)
- **Custom Prompts** - Optimized for recruitment tasks

## 🚀 Quick Start

### Automated Setup (Recommended)

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows:**
```powershell
.\setup.ps1
```

### Manual Setup

1. **Install Dependencies**
```bash
npm run install:all
```

2. **Configure Environment**
```bash
cp .env.example .env
# Edit .env and add your Groq API key (free at https://console.groq.com)
```

3. **Setup Database**
```bash
# Using Docker (recommended)
docker run -d --name recruitment-postgres \
  -e POSTGRES_DB=recruitment_ai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 postgres:15-alpine

# Run migrations
cd backend && npm run migrate && npm run seed
```

4. **Start Application**
```bash
npm run dev
```

5. **Access Application**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Login: `admin@recruitment.ai` / `admin123`

### 🐳 Docker Deployment

```bash
docker-compose up -d
```

Access at http://localhost

## 📁 Project Structure

```
ai-recruitment-pipeline/
├── frontend/                 # React application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── lib/             # Utilities and API client
│   │   └── store/           # State management
│   └── package.json
├── backend/                  # Express API
│   ├── src/
│   │   ├── routes/          # API endpoints
│   │   ├── services/        # Business logic
│   │   ├── middleware/      # Express middleware
│   │   └── database/        # Database schema & migrations
│   └── package.json
├── docker-compose.yml        # Docker orchestration
├── .env.example             # Environment template
└── README.md
```

## 📚 Documentation

- 📖 [Quick Start Guide](./QUICKSTART.md) - Get running in 5 minutes
- 🚀 [Deployment Guide](./DEPLOYMENT.md) - Production deployment instructions
- 🔧 [API Documentation](./backend/API.md) - Complete API reference
- 🌟 [Features Guide](./FEATURES.md) - Detailed feature documentation
- 🏗️ [Architecture](./ARCHITECTURE.md) - System design and architecture
- ⚙️ [Environment Variables](./ENV.md) - Configuration reference

## 🎯 Key Features Explained

### AI-Powered CV Parsing
Upload CVs in PDF, DOC, DOCX, or TXT format. AI automatically extracts:
- Personal information
- Work experience
- Education
- Skills and certifications
- Languages

### Bias-Free Screening
Automatically removes identifying information during initial screening:
- Names, photos, age, gender
- Addresses and location data
- Creates anonymized profiles
- Full audit trail for compliance

### Automated Screening
AI generates relevant questions based on:
- Job requirements
- Required skills
- Experience level
- Industry best practices

### Interview Management
- Automated scheduling
- Calendar integration (Google Calendar)
- Email invitations with .ics files
- Reminder system
- Meeting link generation

### Analytics Dashboard
Real-time insights including:
- Application pipeline status
- Time-to-hire metrics
- Source effectiveness
- Conversion rates
- Hiring trends

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure file uploads
- Audit logging

## 🌐 API Endpoints

```
POST   /api/auth/login              - User authentication
POST   /api/candidates/upload-cv    - Upload and parse CV
GET    /api/jobs                    - List all jobs
POST   /api/screening/generate-questions - Generate AI questions
POST   /api/interviews/schedule     - Schedule interview
GET    /api/analytics/dashboard     - Get analytics data
```

See [API Documentation](./backend/API.md) for complete reference.

## 🆓 Free Tier Limits

All features work on free tiers:
- **Groq API**: 14,400 requests/day (very generous)
- **Gmail SMTP**: 500 emails/day
- **Google Calendar**: 1M requests/day
- **PostgreSQL**: Unlimited (self-hosted)

## 🔧 Configuration

### AI Provider Options

**Option 1: Groq (Recommended)**
```env
AI_PROVIDER=groq
GROQ_API_KEY=your-api-key
```
- Free tier with generous limits
- Very fast inference
- Sign up: https://console.groq.com

**Option 2: Ollama (Local)**
```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```
- 100% free and offline
- Install: https://ollama.ai
- Run: `ollama pull llama3`

### Email Setup (Gmail)

1. Enable 2FA on Gmail
2. Generate app password
3. Add to `.env`:
```env
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

## 🚢 Deployment Options

### VPS (DigitalOcean, AWS, etc.)
```bash
# Clone repo
git clone <repo-url>
cd ai-recruitment-pipeline

# Setup and start
./setup.sh
docker-compose up -d
```

### Heroku
```bash
heroku create your-app
heroku addons:create heroku-postgresql
git push heroku main
```

### Railway
1. Connect GitHub repo
2. Add PostgreSQL
3. Set environment variables
4. Deploy automatically

See [Deployment Guide](./DEPLOYMENT.md) for detailed instructions.

## 🧪 Testing

```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Groq for fast AI inference
- Anthropic for Claude AI assistance
- Open source community

## 📞 Support

- 📧 Email: support@example.com
- 💬 Issues: GitHub Issues
- 📖 Docs: See documentation folder

## 🗺️ Roadmap

- [ ] Video interview recording
- [ ] AI interview analysis
- [ ] Mobile app
- [ ] Advanced matching algorithm
- [ ] Custom workflows
- [ ] API webhooks
- [ ] SSO integration
- [ ] Multi-language support

## ⭐ Star History

If you find this project useful, please consider giving it a star!

---

**Built with ❤️ for better, fairer hiring**
