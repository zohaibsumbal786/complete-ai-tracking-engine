# Deployment Guide

## Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Docker & Docker Compose (for containerized deployment)

## Local Development

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies
cd frontend && npm install && cd ..
```

### 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recruitment_ai

# JWT Secret (generate a secure random string)
JWT_SECRET=your-super-secret-jwt-key-change-this

# AI Provider
AI_PROVIDER=groq
GROQ_API_KEY=your-groq-api-key

# Email (Gmail)
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-specific-password
```

### 3. Setup Database

```bash
# Start PostgreSQL (if using Docker)
docker run -d \
  --name recruitment-postgres \
  -e POSTGRES_DB=recruitment_ai \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -p 5432:5432 \
  postgres:15-alpine

# Run migrations
cd backend
npm run migrate

# Seed initial data
npm run seed
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

## Docker Deployment

### Quick Start

```bash
# Create .env file with your configuration
cp .env.example .env

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

The application will be available at http://localhost

### Docker Services

- `postgres`: PostgreSQL database
- `backend`: Node.js API server
- `frontend`: Nginx serving React app

## Production Deployment

### Option 1: VPS (DigitalOcean, AWS EC2, etc.)

1. **Provision Server**
   - Ubuntu 22.04 LTS
   - Minimum 2GB RAM, 2 vCPUs
   - Open ports: 80, 443, 22

2. **Install Dependencies**

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Install Docker Compose
sudo apt install docker-compose -y

# Install Node.js (optional, for non-Docker deployment)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs
```

3. **Deploy Application**

```bash
# Clone repository
git clone <your-repo-url>
cd ai-recruitment-pipeline

# Configure environment
cp .env.example .env
nano .env  # Edit with production values

# Start with Docker
docker-compose up -d

# Or build and run manually
cd backend && npm install && npm run build
cd ../frontend && npm install && npm run build
```

4. **Setup Nginx (if not using Docker)**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

5. **Setup SSL with Let's Encrypt**

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Option 2: Heroku

1. **Create Heroku Apps**

```bash
# Install Heroku CLI
curl https://cli-assets.heroku.com/install.sh | sh

# Login
heroku login

# Create apps
heroku create your-app-backend
heroku create your-app-frontend
```

2. **Add PostgreSQL**

```bash
heroku addons:create heroku-postgresql:mini -a your-app-backend
```

3. **Configure Environment**

```bash
heroku config:set JWT_SECRET=your-secret -a your-app-backend
heroku config:set GROQ_API_KEY=your-key -a your-app-backend
# ... set other variables
```

4. **Deploy**

```bash
# Backend
cd backend
git init
heroku git:remote -a your-app-backend
git add .
git commit -m "Deploy backend"
git push heroku main

# Frontend
cd ../frontend
# Update API URL in vite.config.ts to point to backend
git init
heroku git:remote -a your-app-frontend
git add .
git commit -m "Deploy frontend"
git push heroku main
```

### Option 3: Railway

1. Visit https://railway.app
2. Create new project
3. Add PostgreSQL database
4. Deploy from GitHub repository
5. Configure environment variables
6. Railway will auto-deploy on git push

## Environment Variables

### Required

- `DATABASE_URL`: PostgreSQL connection string
- `JWT_SECRET`: Secret key for JWT tokens
- `AI_PROVIDER`: "groq" or "ollama"
- `GROQ_API_KEY`: Groq API key (if using Groq)

### Optional

- `SMTP_USER`: Email for sending notifications
- `SMTP_PASSWORD`: Email password
- `GOOGLE_CLIENT_ID`: For Google Calendar integration
- `GOOGLE_CLIENT_SECRET`: For Google Calendar integration

## AI Provider Setup

### Groq (Recommended)

1. Sign up at https://console.groq.com
2. Create API key
3. Set `GROQ_API_KEY` in `.env`
4. Free tier includes generous limits

### Ollama (Local)

1. Install Ollama: https://ollama.ai
2. Pull model: `ollama pull llama3`
3. Set `AI_PROVIDER=ollama` in `.env`
4. Ensure Ollama is running: `ollama serve`

## Email Setup (Gmail)

1. Enable 2-factor authentication on Gmail
2. Generate app-specific password:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. Use generated password in `SMTP_PASSWORD`

## Monitoring

### Health Check

```bash
curl http://localhost:3000/health
```

### Logs

```bash
# Docker
docker-compose logs -f backend
docker-compose logs -f frontend

# PM2 (if using)
pm2 logs
```

## Backup

### Database Backup

```bash
# Docker
docker exec recruitment_db pg_dump -U postgres recruitment_ai > backup.sql

# Restore
docker exec -i recruitment_db psql -U postgres recruitment_ai < backup.sql
```

## Troubleshooting

### Database Connection Issues

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Check connection
psql $DATABASE_URL
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000
lsof -i :5173

# Kill process
kill -9 <PID>
```

### AI Service Errors

- Verify API key is correct
- Check API rate limits
- Ensure Ollama is running (if using local)

## Security Checklist

- [ ] Change default JWT_SECRET
- [ ] Use strong database password
- [ ] Enable HTTPS in production
- [ ] Set secure CORS origins
- [ ] Keep dependencies updated
- [ ] Enable database backups
- [ ] Use environment variables (never commit secrets)
- [ ] Implement rate limiting
- [ ] Enable audit logging
