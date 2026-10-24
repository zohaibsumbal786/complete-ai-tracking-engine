# Getting Started with AI Recruitment Pipeline

Welcome! This guide will help you get the AI Recruitment Pipeline up and running quickly.

## 📋 Prerequisites Checklist

Before you begin, make sure you have:

- [ ] **Node.js 18+** installed ([Download](https://nodejs.org/))
- [ ] **PostgreSQL 14+** OR **Docker** installed
- [ ] **Git** installed
- [ ] **Groq API Key** (free at [console.groq.com](https://console.groq.com))
- [ ] **Gmail account** (optional, for email features)

## 🎯 Choose Your Setup Method

### Option 1: Automated Setup (Recommended) ⚡

**For Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**For Windows:**
```powershell
.\setup.ps1
```

The script will:
1. Check prerequisites
2. Install all dependencies
3. Setup database
4. Run migrations
5. Seed sample data
6. Guide you through configuration

### Option 2: Docker (Easiest) 🐳

```bash
# 1. Copy environment file
cp .env.example .env

# 2. Edit .env and add your Groq API key
# GROQ_API_KEY=your-key-here

# 3. Start everything
docker-compose up -d

# 4. Access at http://localhost
```

### Option 3: Manual Setup (Full Control) 🔧

Follow the detailed steps below.

## 📝 Manual Setup Steps

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd ai-recruitment-pipeline

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
```

### Step 2: Get Your Groq API Key

1. Go to [console.groq.com](https://console.groq.com)
2. Sign up for free account
3. Create a new API key
4. Copy the key (starts with `gsk_`)

**Free Tier Includes:**
- 14,400 requests per day
- Access to Llama 3.1 70B model
- Very fast inference

### Step 3: Configure Environment

```bash
# Copy the example environment file
cp .env.example .env
```

Edit `.env` and update these values:

```env
# Required: Add your Groq API key
GROQ_API_KEY=gsk_your_actual_api_key_here

# Required: Set a secure JWT secret (at least 32 characters)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Optional: Email configuration (for notifications)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

**Generate a secure JWT secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 4: Setup Database

**Option A: Using Docker (Recommended)**

```bash
docker run -d \
  --name recruitment-postgres \
  -e POSTGRES_DB=recruitment_ai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine
```

**Option B: Using Local PostgreSQL**

```bash
# Create database
createdb recruitment_ai

# Or using psql
psql -U postgres -c "CREATE DATABASE recruitment_ai;"
```

### Step 5: Initialize Database

```bash
cd backend

# Run migrations (creates tables)
npm run migrate

# Seed sample data (creates admin user and sample jobs)
npm run seed

cd ..
```

You should see:
```
✅ Migrations completed successfully
✅ Database seeded successfully
📧 Admin credentials: admin@recruitment.ai / admin123
```

### Step 6: Start Development Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

You should see:
```
🚀 Server running on port 3000
📊 Environment: development
✅ Database connected
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.0.8  ready in 500 ms
➜  Local:   http://localhost:5173/
```

### Step 7: Access the Application

Open your browser and go to:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000

**Login with:**
- Email: `admin@recruitment.ai`
- Password: `admin123`

## 🎉 First Steps After Login

### 1. Upload Your First CV

1. Click **"Candidates"** in the sidebar
2. Click **"Upload CV"** button
3. Drag & drop a resume (PDF, DOC, DOCX, or TXT)
4. Watch AI automatically parse the information!

### 2. Create a Job Position

1. Click **"Jobs"** in the sidebar
2. Click **"Create Job"** button
3. Fill in job details:
   - Title (e.g., "Senior Developer")
   - Description
   - Salary range
4. Click **"Create Job"**

### 3. Generate Screening Questions

1. Go to **"Jobs"** page
2. Select a job
3. Click **"Generate Questions"**
4. AI will create 10 relevant screening questions
5. Review and edit if needed

### 4. Schedule an Interview

1. Go to **"Interviews"** page
2. Click **"Schedule Interview"**
3. Select a candidate
4. Choose date/time
5. Add meeting link (Zoom, Google Meet, etc.)
6. System sends email invitation automatically!

### 5. View Analytics

1. Go to **"Dashboard"**
2. See real-time statistics:
   - Total applications
   - Shortlisted candidates
   - Hired count
   - Active jobs
3. View hiring insights chart
4. Check recent applications

## 🔧 Configuration Options

### Email Setup (Optional but Recommended)

To enable email notifications:

1. **Enable 2FA on Gmail**
   - Go to Google Account settings
   - Security → 2-Step Verification

2. **Generate App Password**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and your device
   - Copy the generated password

3. **Update .env**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=generated-app-password
   ```

4. **Restart backend**
   ```bash
   cd backend
   npm run dev
   ```

### Using Local AI (Ollama)

If you prefer 100% offline AI:

1. **Install Ollama**
   - Visit: https://ollama.ai
   - Download and install

2. **Pull Model**
   ```bash
   ollama pull llama3
   ```

3. **Update .env**
   ```env
   AI_PROVIDER=ollama
   OLLAMA_BASE_URL=http://localhost:11434
   ```

4. **Start Ollama**
   ```bash
   ollama serve
   ```

## 🐛 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Linux/Mac
lsof -ti:3000 | xargs kill -9
```

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Or for local PostgreSQL
pg_isready

# Restart PostgreSQL container
docker restart recruitment-postgres
```

### AI Service Error

**"Invalid API key"**
- Verify your Groq API key in `.env`
- Make sure it starts with `gsk_`
- Check you have internet connection

**"Rate limit exceeded"**
- Free tier: 14,400 requests/day
- Wait or switch to Ollama (local)

### Frontend Not Loading

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend Errors

```bash
# Check logs
cd backend
npm run dev

# Verify database connection
psql $DATABASE_URL
```

## 📚 Next Steps

### Learn More
- Read [FEATURES.md](./FEATURES.md) for detailed feature documentation
- Check [API.md](./backend/API.md) for API reference
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for system design

### Customize
- Modify UI colors in `frontend/tailwind.config.js`
- Add custom screening questions
- Configure email templates
- Adjust AI prompts in `backend/src/services/ai.service.ts`

### Deploy to Production
- Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
- Setup SSL certificate
- Configure production database
- Enable monitoring

## 🆘 Getting Help

### Common Issues

**Q: Can I use this without Groq API?**  
A: Yes! Use Ollama for 100% free local AI.

**Q: Do I need Gmail for emails?**  
A: No, any SMTP server works. Gmail is just an example.

**Q: Can I deploy this for free?**  
A: Yes! Use Railway, Heroku free tier, or your own VPS.

**Q: Is this production-ready?**  
A: Yes! It includes security, error handling, and scalability features.

**Q: Can I customize the UI?**  
A: Absolutely! It's built with React and Tailwind CSS.

### Support Channels

- 📖 Documentation: Check the docs folder
- 🐛 Issues: GitHub Issues
- 💬 Discussions: GitHub Discussions
- 📧 Email: support@example.com

## ✅ Success Checklist

After setup, verify everything works:

- [ ] Can login with admin credentials
- [ ] Can upload and parse a CV
- [ ] Can create a new job
- [ ] Can generate screening questions
- [ ] Can schedule an interview
- [ ] Dashboard shows data
- [ ] No errors in browser console
- [ ] No errors in backend logs

## 🎊 You're All Set!

Congratulations! Your AI Recruitment Pipeline is now running.

**What you can do now:**
- Upload CVs and watch AI parse them
- Create job postings
- Generate screening questions
- Schedule interviews
- Track candidates through the pipeline
- View analytics and insights

**Remember:**
- Default login: `admin@recruitment.ai` / `admin123`
- Change password after first login
- Backup your database regularly
- Keep your API keys secure

Happy recruiting! 🚀

---

**Need more help?** Check out:
- [Quick Start Guide](./QUICKSTART.md) - 5-minute overview
- [Features Guide](./FEATURES.md) - What you can do
- [Deployment Guide](./DEPLOYMENT.md) - Go to production
