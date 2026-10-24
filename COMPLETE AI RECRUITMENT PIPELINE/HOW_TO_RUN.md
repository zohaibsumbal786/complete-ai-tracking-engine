# 🎯 How to Run the AI Recruitment Pipeline

## ⚡ FASTEST WAY (Recommended)

### Using the Batch Script

1. **Make sure Docker Desktop is running**
2. **Double-click:** `QUICK_RUN.bat`
3. **Wait 30 seconds** for services to start
4. **Browser opens automatically** at http://localhost
5. **Login:** admin@recruitment.ai / admin123

That's it! The script handles everything.

---

## 🐳 Using Docker Compose Manually

### Prerequisites
- Docker Desktop installed and running

### Steps

```powershell
# 1. Start Docker Desktop (if not running)

# 2. Build and start all services
docker-compose up -d --build

# 3. Wait 30 seconds for services to initialize

# 4. Open browser
start http://localhost

# 5. Login
# Email: admin@recruitment.ai
# Password: admin123
```

### To Stop
```powershell
docker-compose down
```

### To View Logs
```powershell
docker-compose logs -f
```

---

## 🔧 Manual Setup (Without Docker)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Step 1: Install Dependencies

```powershell
# Root
npm install

# Backend
cd backend
npm install
cd ..

# Frontend
cd frontend
npm install
cd ..
```

### Step 2: Setup Database

**Option A: Docker PostgreSQL**
```powershell
docker run -d --name recruitment-postgres -e POSTGRES_DB=recruitment_ai -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -p 5432:5432 postgres:15-alpine
```

**Option B: Local PostgreSQL**
```powershell
createdb recruitment_ai
```

### Step 3: Initialize Database

```powershell
cd backend
npm run migrate
npm run seed
cd ..
```

### Step 4: Start Servers

**Terminal 1 - Backend:**
```powershell
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Step 5: Access Application

- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Login: admin@recruitment.ai / admin123

---

## 🎨 What You'll See

### Login Page
Beautiful authentication interface with demo credentials displayed

### Dashboard
- Real-time statistics
- Active roles panel
- Hiring insights chart
- Application pipeline

### Jobs Management
- Create job postings
- View active roles
- Manage requirements
- Track applicants

### Candidates
- Upload CVs (drag & drop)
- AI-powered parsing
- Profile management
- Search & filter

### Applications
- Track pipeline stages
- Update status
- View scores
- Add notes

### Interviews
- Schedule meetings
- Send invitations
- Calendar sync
- Meeting links

### Analytics
- Time-to-hire metrics
- Conversion rates
- Detailed reports
- Export data

---

## 🤖 Enable AI Features

### Option 1: Groq API (Recommended - Fast & Free)

1. **Sign up:** https://console.groq.com
2. **Create API key**
3. **Edit `.env`:**
   ```env
   GROQ_API_KEY=your-api-key-here
   ```
4. **Restart backend**

**Free Tier:** 14,400 requests/day

### Option 2: Ollama (100% Free, Local)

1. **Install:** https://ollama.ai
2. **Pull model:**
   ```powershell
   ollama pull llama3
   ```
3. **Start Ollama:**
   ```powershell
   ollama serve
   ```
4. **Edit `.env`:**
   ```env
   AI_PROVIDER=ollama
   ```
5. **Restart backend**

---

## 📧 Enable Email Features (Optional)

### Using Gmail

1. **Enable 2FA** on your Gmail account
2. **Generate app password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Create password for "Mail"
3. **Edit `.env`:**
   ```env
   SMTP_USER=your-email@gmail.com
   SMTP_PASSWORD=your-app-password
   ```
4. **Restart backend**

---

## 🔍 Testing the Features

### 1. Upload a CV
1. Go to **Candidates** page
2. Click **"Upload CV"**
3. Drag & drop a resume (PDF, DOC, DOCX, TXT)
4. AI automatically parses information
5. View structured candidate profile

### 2. Create a Job
1. Go to **Jobs** page
2. Click **"Create Job"**
3. Fill in:
   - Title (e.g., "Senior Developer")
   - Description
   - Salary range
4. Click **"Create Job"**

### 3. Generate Screening Questions
1. Select a job
2. Click **"Generate Questions"**
3. AI creates 10 relevant questions
4. Review and edit if needed
5. Questions ready for candidates

### 4. Schedule an Interview
1. Go to **Interviews** page
2. Click **"Schedule Interview"**
3. Select candidate
4. Choose date/time
5. Add meeting link
6. System sends email invitation

### 5. View Analytics
1. Go to **Dashboard** or **Analytics**
2. See real-time metrics:
   - Total applications
   - Shortlisted candidates
   - Hired count
   - Time-to-hire
   - Conversion rates

---

## 🐛 Troubleshooting

### Docker Issues

**"Cannot connect to Docker daemon"**
- Start Docker Desktop application
- Wait for it to fully start (green icon)

**"Port already in use"**
```powershell
docker-compose down
docker ps -a
docker rm -f <container-name>
```

### Database Issues

**"Connection refused"**
```powershell
# Check if PostgreSQL is running
docker ps | findstr postgres

# Restart container
docker restart recruitment-postgres
```

### Port Conflicts

**"Port 3000 already in use"**
```powershell
npx kill-port 3000
```

**"Port 5173 already in use"**
```powershell
npx kill-port 5173
```

### Installation Issues

**"Dependencies taking too long"**
- This is normal for first install
- Backend: ~15 packages
- Frontend: ~15 packages
- Total time: 2-5 minutes

**"npm install fails"**
```powershell
# Clear cache and retry
npm cache clean --force
npm install
```

### AI Service Issues

**"AI service error"**
- Check your Groq API key in `.env`
- Verify internet connection
- Try Ollama for local AI

**"Rate limit exceeded"**
- Groq free tier: 14,400/day
- Wait or switch to Ollama

---

## 📊 System Status Check

### Check if Everything is Running

**Docker:**
```powershell
docker ps
```

Should show 3 containers:
- recruitment_frontend
- recruitment_backend
- recruitment_db

**Manual:**
```powershell
# Backend should show:
# 🚀 Server running on port 3000
# ✅ Database connected

# Frontend should show:
# ➜  Local:   http://localhost:5173/
```

### Health Check

**Backend API:**
```powershell
curl http://localhost:3000/health
```

Should return: `{"status":"ok"}`

---

## 🎯 Quick Reference

### Default Credentials
- Email: `admin@recruitment.ai`
- Password: `admin123`

### URLs
- Frontend: http://localhost (Docker) or http://localhost:5173 (Manual)
- Backend: http://localhost:3000
- Health: http://localhost:3000/health

### Commands

**Docker:**
```powershell
docker-compose up -d          # Start
docker-compose down           # Stop
docker-compose logs -f        # View logs
docker-compose restart        # Restart
```

**Manual:**
```powershell
npm run dev                   # Start both (from root)
cd backend && npm run dev     # Backend only
cd frontend && npm run dev    # Frontend only
```

---

## 📚 Documentation

- **START_HERE.md** - Quick introduction
- **GETTING_STARTED.md** - Detailed setup
- **RUN_DEMO.md** - Demo guide
- **FEATURES.md** - Feature documentation
- **DEPLOYMENT.md** - Production deployment
- **backend/API.md** - API reference

---

## ✅ Success Checklist

After starting, verify:

- [ ] Can access login page
- [ ] Can login with demo credentials
- [ ] Dashboard loads with data
- [ ] Can navigate between pages
- [ ] No errors in browser console
- [ ] Backend logs show no errors

---

## 🎉 You're Ready!

The system is complete and ready to use. Choose your preferred method:

1. **Easiest:** Double-click `QUICK_RUN.bat`
2. **Docker:** Run `docker-compose up -d`
3. **Manual:** Follow manual setup steps

Then open http://localhost and start exploring!

---

**Need help?** Check the documentation files or create an issue.

**Happy recruiting! 🚀**
