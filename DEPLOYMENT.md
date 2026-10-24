# Deployment Guide

This guide covers deploying the AI Tracking Engine to free hosting services.

## Option 1: Vercel + Railway (Recommended)

### Prerequisites
- GitHub account
- Vercel account (free)
- Railway account (free)

### Step 1: Deploy Backend to Railway

1. Push your code to GitHub
2. Go to [Railway](https://railway.app)
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Add environment variables:
   ```
   DATABASE_URL=<railway_postgres_url>
   QDRANT_URL=<qdrant_cloud_url>
   TOGETHER_API_KEY=<your_key>
   PORT=5000
   ```
6. Railway will automatically deploy your backend

### Step 2: Setup Qdrant Cloud

1. Go to [Qdrant Cloud](https://cloud.qdrant.io)
2. Create free cluster (1GB)
3. Get cluster URL and API key
4. Update Railway environment variables

### Step 3: Deploy Frontend to Vercel

1. Go to [Vercel](https://vercel.com)
2. Import your GitHub repository
3. Set root directory to `frontend`
4. Add environment variable:
   ```
   VITE_API_URL=<your_railway_backend_url>
   ```
5. Deploy

## Option 2: Docker Compose (Self-Hosted)

### Prerequisites
- VPS with Docker installed
- Domain name (optional)

### Steps

1. Clone repository on your server:
```bash
git clone <your-repo>
cd ai-tracking-engine
```

2. Create `.env` file:
```bash
cp .env.example .env
# Edit .env with your values
```

3. Start services:
```bash
docker-compose up -d
```

4. Setup reverse proxy (nginx):
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
    }

    location /api {
        proxy_pass http://localhost:5000;
    }
}
```

## Option 3: Render

### Backend

1. Go to [Render](https://render.com)
2. New → Web Service
3. Connect GitHub repo
4. Settings:
   - Root Directory: `backend`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
5. Add environment variables

### Frontend

1. New → Static Site
2. Settings:
   - Root Directory: `frontend`
   - Build Command: `npm install && npm run build`
   - Publish Directory: `dist`
3. Add environment variable: `VITE_API_URL`

## Post-Deployment

### 1. Upload Sample Documents
- Navigate to your deployed app
- Go to Query tab
- Upload sample PDF/Markdown files

### 2. Test Query System
- Ask a question about your documentation
- Verify confidence scores are calculated

### 3. Run Initial Clustering
```bash
# SSH into your backend server or use Railway CLI
npm run cluster:weekly
```

### 4. Setup Monitoring
- Check Railway/Vercel logs
- Monitor Qdrant usage
- Track API costs (Together AI)

## Scaling Considerations

### Free Tier Limits
- **Vercel**: 100GB bandwidth/month
- **Railway**: $5 credit/month
- **Qdrant Cloud**: 1GB storage
- **Together AI**: $25 credit (one-time)

### When to Upgrade
- More than 10,000 queries/month
- Need more than 1GB vector storage
- Require faster response times

### Cost Optimization
1. Cache frequent queries
2. Batch embedding generation
3. Use smaller embedding models
4. Implement rate limiting

## Troubleshooting

### Backend won't start
- Check DATABASE_URL is correct
- Verify Qdrant is accessible
- Ensure TOGETHER_API_KEY is valid

### Frontend can't connect
- Verify VITE_API_URL points to backend
- Check CORS settings in backend
- Ensure backend is running

### Low confidence scores
- Upload more documentation
- Improve document quality
- Adjust confidence formula weights

## Security Checklist

- [ ] Environment variables are not committed
- [ ] Database has strong password
- [ ] API keys are rotated regularly
- [ ] CORS is properly configured
- [ ] Rate limiting is enabled
- [ ] HTTPS is enforced

## Backup Strategy

### Database Backup
```bash
# PostgreSQL backup
pg_dump $DATABASE_URL > backup.sql
```

### Qdrant Backup
- Use Qdrant Cloud automatic backups
- Or export collections manually

### Document Backup
- Keep original files in separate storage
- Consider S3/Cloudflare R2 for uploads

---

For issues, check logs first:
- Railway: Dashboard → Deployments → Logs
- Vercel: Dashboard → Deployments → Function Logs
- Qdrant: Cloud Dashboard → Metrics
