# ⚡ Quick Start Guide

Get the AI Tracking Engine running in under 5 minutes!

## 🚀 Super Fast Setup

### Step 1: Get API Key (2 minutes)
1. Go to https://api.together.xyz/
2. Sign up (free)
3. Copy your API key

### Step 2: Clone & Configure (1 minute)
```bash
# Clone the repo
git clone <your-repo-url>
cd ai-tracking-engine

# Setup environment
cp .env.example .env
# Edit .env and paste your Together AI API key
```

### Step 3: Start Everything (2 minutes)
```bash
# Option A: With Docker (Recommended)
docker-compose up -d

# Option B: Without Docker
npm run install:all
npm run dev
```

### Step 4: Use It! (Now!)
1. Open http://localhost:3000
2. Upload `sample-docs/employee-handbook.md`
3. Ask: "What are the working hours?"
4. See your answer with confidence score!

---

## 📱 What You Get

### Query Interface
- Upload documents (PDF/Markdown)
- Ask questions
- Get AI answers with confidence scores
- See source citations

### Dashboard
- Kanban board (To Update → In Progress → In Review → Done)
- Drag-and-drop SOP cards
- Priority indicators
- Question metrics

### Analytics
- Total queries
- Average confidence
- Weekly trends
- Automated insights

---

## 🎯 Try These Questions

After uploading the sample handbook:

1. **"What are the working hours?"**
   - Expected: High confidence (>80%)
   - Answer: 9 AM - 5 PM

2. **"How many vacation days do I get?"**
   - Expected: High confidence
   - Answer: 20 days per year

3. **"What is the expense policy?"**
   - Expected: Medium-high confidence
   - Answer: Details about reimbursement

4. **"What is the quantum computing policy?"**
   - Expected: Low confidence (<50%)
   - Shows gap detection working!

---

## 🔧 Common Commands

```bash
# Start everything
docker-compose up -d

# Stop everything
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Run clustering manually
cd backend && npm run cluster:weekly

# Check health
curl http://localhost:5000/health
```

---

## 📊 Check It's Working

### Backend Health
```bash
curl http://localhost:5000/health
# Should return: {"status":"ok","timestamp":"..."}
```

### Frontend
Open http://localhost:3000
- Should see "AI Tracking Engine" header
- Three tabs: Query, Dashboard, Analytics

### Database
```bash
docker exec -it postgres psql -U postgres -d ai_tracking -c "SELECT COUNT(*) FROM queries;"
# Should return query count
```

### Qdrant
Open http://localhost:6333/dashboard
- Should see "documents" collection

---

## 🐛 Quick Fixes

### "Cannot connect to database"
```bash
docker-compose restart postgres
# Wait 10 seconds
docker-compose restart backend
```

### "Qdrant connection failed"
```bash
docker-compose restart qdrant
# Wait 10 seconds
docker-compose restart backend
```

### "Together AI error"
- Check your API key in `.env`
- Verify you have credits: https://api.together.xyz/

### "Port already in use"
```bash
# Change ports in docker-compose.yml
# Frontend: 3000 → 3001
# Backend: 5000 → 5001
```

---

## 📚 Next Steps

1. **Upload Your Docs**
   - Add your company's actual documentation
   - PDFs or Markdown files
   - Start with 5-10 documents

2. **Ask Real Questions**
   - Have team members ask questions
   - Monitor confidence scores
   - Identify gaps

3. **Run Clustering**
   ```bash
   cd backend && npm run cluster:weekly
   ```

4. **Check Dashboard**
   - See SOP updates needed
   - Prioritize documentation work
   - Assign team members

5. **Deploy to Production**
   - Follow [DEPLOYMENT.md](./DEPLOYMENT.md)
   - Use free hosting (Vercel + Railway)
   - Takes ~30 minutes

---

## 🎓 Learn More

- **Full Setup:** [SETUP.md](./SETUP.md)
- **Architecture:** [ARCHITECTURE.md](./ARCHITECTURE.md)
- **Deployment:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Testing:** [TESTING.md](./TESTING.md)
- **FAQ:** [FAQ.md](./FAQ.md)

---

## 💡 Pro Tips

1. **Better Answers:** Upload more comprehensive docs
2. **Faster Queries:** Use smaller documents (<50 pages)
3. **Better Clustering:** Run weekly, not daily
4. **Monitor Usage:** Check Together AI dashboard
5. **Backup Data:** Export queries monthly

---

## 🆘 Need Help?

1. Check [FAQ.md](./FAQ.md)
2. Review logs: `docker-compose logs -f`
3. Open GitHub issue
4. Check [TESTING.md](./TESTING.md) for diagnostics

---

## ✅ Success Checklist

- [ ] Docker running
- [ ] API key configured
- [ ] Services started
- [ ] Frontend accessible (http://localhost:3000)
- [ ] Backend healthy (http://localhost:5000/health)
- [ ] Sample doc uploaded
- [ ] Question answered
- [ ] Confidence score shown

---

**You're ready to go! Start tracking your documentation gaps! 🚀**

---

*Total setup time: < 5 minutes*
*Total learning time: < 30 minutes*
*Total value: Priceless* 😊
