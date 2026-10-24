# 🎯 START HERE - AI Recruitment Pipeline

Welcome! This is your complete AI-powered recruitment automation platform.

## 🚀 What You Have

A **production-ready, full-stack web application** that automates recruitment from CV parsing to interview scheduling, with:

✅ **61+ files** of professional code  
✅ **26 API endpoints** fully implemented  
✅ **9 beautiful pages** with modern UI  
✅ **AI-powered** CV parsing and screening  
✅ **100% free** to run (no paid APIs required)  
✅ **Docker-ready** for instant deployment  
✅ **Comprehensive documentation** (10 guides)  

## ⚡ Quick Start (Choose One)

### Option 1: Automated Setup (5 minutes)

**Linux/Mac:**
```bash
chmod +x setup.sh && ./setup.sh
```

**Windows:**
```powershell
.\setup.ps1
```

### Option 2: Docker (2 minutes)

```bash
cp .env.example .env
# Edit .env and add GROQ_API_KEY
docker-compose up -d
```

### Option 3: Manual Setup

See [GETTING_STARTED.md](./GETTING_STARTED.md)

## 📚 Documentation Guide

**Start with these (in order):**

1. **[GETTING_STARTED.md](./GETTING_STARTED.md)** ← Start here for detailed setup
2. **[QUICKSTART.md](./QUICKSTART.md)** ← 5-minute overview
3. **[FEATURES.md](./FEATURES.md)** ← What you can do
4. **[backend/API.md](./backend/API.md)** ← API reference

**For deployment:**

5. **[DEPLOYMENT.md](./DEPLOYMENT.md)** ← Production deployment
6. **[ENV.md](./ENV.md)** ← Environment configuration

**For understanding:**

7. **[ARCHITECTURE.md](./ARCHITECTURE.md)** ← System design
8. **[PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md)** ← File organization
9. **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** ← Complete overview

## 🎯 What You Need

### Required
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** OR **Docker** - [Docker](https://www.docker.com/)
- **Groq API Key** - Free at [console.groq.com](https://console.groq.com)

### Optional
- **Gmail account** - For email notifications
- **Google Calendar** - For calendar integration

## 🏃 After Setup

**Access the application:**
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**Login with:**
- Email: `admin@recruitment.ai`
- Password: `admin123`

**Try these features:**
1. Upload a CV (Candidates → Upload CV)
2. Create a job (Jobs → Create Job)
3. Generate screening questions (AI-powered!)
4. Schedule an interview
5. View analytics dashboard

## 📦 What's Included

### Frontend (React + TypeScript)
- Dashboard with real-time analytics
- Job management interface
- Candidate pipeline (Kanban)
- CV upload with drag-and-drop
- Interview scheduling
- Analytics and reporting
- Beautiful, responsive UI

### Backend (Node.js + Express)
- RESTful API (26 endpoints)
- JWT authentication
- AI integration (Groq/Ollama)
- Email automation
- CV parsing
- Database migrations
- Comprehensive error handling

### Database (PostgreSQL)
- 8 normalized tables
- Proper relationships
- Indexes for performance
- Migration system
- Seed data

### Infrastructure
- Docker Compose setup
- Nginx configuration
- Automated setup scripts
- Environment management

## 🎨 Key Features

1. **AI CV Parsing** - Upload resumes, AI extracts structured data
2. **Bias-Free Screening** - Remove identifying info for fair evaluation
3. **Smart Questions** - AI generates relevant screening questions
4. **Interview Scheduling** - Automated with calendar sync
5. **Email Automation** - Invitations, reminders, notifications
6. **Real-Time Dashboard** - Analytics and insights
7. **Pipeline Management** - Track candidates through stages
8. **Audit Trail** - Compliance and tracking

## 🆓 100% Free to Run

All services have generous free tiers:
- **Groq API**: 14,400 requests/day
- **Gmail SMTP**: 500 emails/day
- **Google Calendar**: 1M requests/day
- **PostgreSQL**: Unlimited (self-hosted)
- **Ollama**: 100% free (local AI option)

## 🔧 Tech Stack

**Frontend:** React, TypeScript, Tailwind CSS, Vite  
**Backend:** Node.js, Express, TypeScript  
**Database:** PostgreSQL  
**AI:** Groq (Llama 3.1 70B) or Ollama  
**Deployment:** Docker, Docker Compose, Nginx  

## 📖 Documentation Structure

```
START_HERE.md              ← You are here!
├── GETTING_STARTED.md     ← Detailed setup guide
├── QUICKSTART.md          ← 5-minute overview
├── FEATURES.md            ← Feature documentation
├── DEPLOYMENT.md          ← Production deployment
├── ENV.md                 ← Environment variables
├── ARCHITECTURE.md        ← System design
├── PROJECT_STRUCTURE.md   ← File organization
├── PROJECT_SUMMARY.md     ← Complete overview
└── backend/API.md         ← API reference
```

## 🐛 Troubleshooting

**Port already in use?**
```bash
npx kill-port 3000
npx kill-port 5173
```

**Database connection error?**
```bash
docker ps | grep postgres
docker restart recruitment-postgres
```

**AI service error?**
- Check your Groq API key in `.env`
- Verify internet connection
- Try Ollama for local AI

**More help:** See [GETTING_STARTED.md](./GETTING_STARTED.md#troubleshooting)

## 🚢 Deployment Options

1. **VPS** (DigitalOcean, AWS, etc.) - Full control
2. **Heroku** - Easy deployment
3. **Railway** - Auto-deploy from Git
4. **Docker** - Any Docker host

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

## ✅ Success Checklist

After setup, verify:
- [ ] Can login with admin credentials
- [ ] Can upload and parse a CV
- [ ] Can create a new job
- [ ] Can generate screening questions
- [ ] Can schedule an interview
- [ ] Dashboard shows data
- [ ] No errors in console

## 🎓 Learning Path

**Day 1: Setup & Basics**
1. Run automated setup
2. Login and explore UI
3. Upload a test CV
4. Create a sample job

**Day 2: Core Features**
1. Generate screening questions
2. Schedule an interview
3. Track application pipeline
4. View analytics

**Day 3: Customization**
1. Configure email notifications
2. Customize UI colors
3. Add custom questions
4. Explore API endpoints

**Day 4: Deployment**
1. Setup production database
2. Configure environment
3. Deploy with Docker
4. Setup SSL certificate

## 🔗 Quick Links

- **Groq API**: https://console.groq.com
- **Ollama**: https://ollama.ai
- **Docker**: https://www.docker.com
- **Node.js**: https://nodejs.org
- **PostgreSQL**: https://www.postgresql.org

## 💡 Pro Tips

1. **Use Groq for speed** - Much faster than Ollama
2. **Enable email early** - Better user experience
3. **Backup database** - Run regular backups
4. **Monitor logs** - Check for errors
5. **Update regularly** - Keep dependencies current

## 🎯 Next Steps

1. **Setup**: Run `./setup.sh` or `.\setup.ps1`
2. **Explore**: Login and try features
3. **Customize**: Adjust to your needs
4. **Deploy**: Go to production
5. **Scale**: Add more features

## 📞 Need Help?

- 📖 **Documentation**: Check the guides above
- 🐛 **Issues**: Create GitHub issue
- 💬 **Questions**: GitHub Discussions
- 📧 **Email**: support@example.com

## 🎉 You're Ready!

This is a **complete, professional-grade** recruitment platform ready for immediate use.

**What makes it special:**
- Production-ready code
- Comprehensive documentation
- 100% free to run
- Modern tech stack
- Bias-free hiring
- Easy deployment
- Scalable architecture

**Start now:**
```bash
./setup.sh  # or .\setup.ps1 on Windows
```

Then open http://localhost:5173 and login with:
- Email: `admin@recruitment.ai`
- Password: `admin123`

---

**Happy recruiting! 🚀**

*Built with ❤️ for better, fairer hiring*
