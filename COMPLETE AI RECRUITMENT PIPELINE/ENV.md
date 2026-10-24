# Environment Variables Guide

## Overview

This document explains all environment variables used in the AI Recruitment Pipeline system.

## Database Configuration

### DATABASE_URL
**Required**: Yes  
**Default**: None  
**Example**: `postgresql://postgres:postgres@localhost:5432/recruitment_ai`

Full PostgreSQL connection string. Format:
```
postgresql://[user]:[password]@[host]:[port]/[database]
```

### DB_HOST
**Required**: No (if DATABASE_URL is set)  
**Default**: `localhost`  
**Example**: `localhost`

PostgreSQL host address.

### DB_PORT
**Required**: No  
**Default**: `5432`  
**Example**: `5432`

PostgreSQL port number.

### DB_NAME
**Required**: No (if DATABASE_URL is set)  
**Default**: `recruitment_ai`  
**Example**: `recruitment_ai`

Database name.

### DB_USER
**Required**: No (if DATABASE_URL is set)  
**Default**: `postgres`  
**Example**: `postgres`

Database username.

### DB_PASSWORD
**Required**: No (if DATABASE_URL is set)  
**Default**: `postgres`  
**Example**: `your-secure-password`

Database password.

## Server Configuration

### NODE_ENV
**Required**: No  
**Default**: `development`  
**Options**: `development`, `production`, `test`

Application environment mode.

### PORT
**Required**: No  
**Default**: `3000`  
**Example**: `3000`

Backend server port.

### FRONTEND_URL
**Required**: No  
**Default**: `http://localhost:5173`  
**Example**: `https://your-domain.com`

Frontend application URL (used for CORS).

## Authentication

### JWT_SECRET
**Required**: Yes  
**Default**: None  
**Example**: `your-super-secret-jwt-key-min-32-chars`

Secret key for signing JWT tokens. Must be at least 32 characters.

**Generate secure secret:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### JWT_EXPIRES_IN
**Required**: No  
**Default**: `7d`  
**Example**: `7d`, `24h`, `30d`

JWT token expiration time.

## AI Provider Configuration

### AI_PROVIDER
**Required**: Yes  
**Default**: `groq`  
**Options**: `groq`, `ollama`

AI service provider to use.

### GROQ_API_KEY
**Required**: If AI_PROVIDER=groq  
**Default**: None  
**Example**: `gsk_xxxxxxxxxxxxxxxxxxxxx`

Groq API key. Get from https://console.groq.com

### OLLAMA_BASE_URL
**Required**: If AI_PROVIDER=ollama  
**Default**: `http://localhost:11434`  
**Example**: `http://localhost:11434`

Ollama server URL for local AI.

## Email Configuration

### SMTP_HOST
**Required**: For email features  
**Default**: `smtp.gmail.com`  
**Example**: `smtp.gmail.com`

SMTP server hostname.

### SMTP_PORT
**Required**: For email features  
**Default**: `587`  
**Example**: `587`

SMTP server port.

### SMTP_SECURE
**Required**: No  
**Default**: `false`  
**Options**: `true`, `false`

Use TLS for SMTP connection.

### SMTP_USER
**Required**: For email features  
**Default**: None  
**Example**: `your-email@gmail.com`

SMTP username (email address).

### SMTP_PASSWORD
**Required**: For email features  
**Default**: None  
**Example**: `your-app-specific-password`

SMTP password. For Gmail, use app-specific password.

**Gmail Setup:**
1. Enable 2FA on your Google account
2. Go to: https://myaccount.google.com/apppasswords
3. Generate app password for "Mail"
4. Use generated password here

## Google Calendar Integration

### GOOGLE_CLIENT_ID
**Required**: For calendar features  
**Default**: None  
**Example**: `123456789-abcdefg.apps.googleusercontent.com`

Google OAuth client ID.

### GOOGLE_CLIENT_SECRET
**Required**: For calendar features  
**Default**: None  
**Example**: `GOCSPX-xxxxxxxxxxxxx`

Google OAuth client secret.

### GOOGLE_REDIRECT_URI
**Required**: For calendar features  
**Default**: `http://localhost:3000/api/integrations/google-calendar/callback`  
**Example**: `https://your-domain.com/api/integrations/google-calendar/callback`

OAuth redirect URI.

**Setup:**
1. Go to: https://console.cloud.google.com
2. Create project
3. Enable Google Calendar API
4. Create OAuth 2.0 credentials
5. Add redirect URI
6. Copy client ID and secret

## File Upload

### MAX_FILE_SIZE
**Required**: No  
**Default**: `10485760` (10MB)  
**Example**: `10485760`

Maximum file upload size in bytes.

### UPLOAD_DIR
**Required**: No  
**Default**: `./uploads`  
**Example**: `./uploads`

Directory for uploaded files.

## CORS Configuration

### CORS_ORIGIN
**Required**: No  
**Default**: `http://localhost:5173`  
**Example**: `https://your-domain.com`

Allowed CORS origin for frontend.

## Example .env Files

### Development

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/recruitment_ai

# Server
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173

# JWT
JWT_SECRET=dev-secret-key-change-in-production-min-32-chars
JWT_EXPIRES_IN=7d

# AI
AI_PROVIDER=groq
GROQ_API_KEY=gsk_your_groq_api_key_here

# Email (optional for dev)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=./uploads

# CORS
CORS_ORIGIN=http://localhost:5173
```

### Production

```env
# Database
DATABASE_URL=postgresql://user:password@prod-db-host:5432/recruitment_ai

# Server
NODE_ENV=production
PORT=3000
FRONTEND_URL=https://your-domain.com

# JWT (use strong secret!)
JWT_SECRET=<generate-with-crypto-randomBytes-64-chars>
JWT_EXPIRES_IN=7d

# AI
AI_PROVIDER=groq
GROQ_API_KEY=gsk_production_api_key

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=noreply@your-domain.com
SMTP_PASSWORD=production-app-password

# Google Calendar
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=https://your-domain.com/api/integrations/google-calendar/callback

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/var/app/uploads

# CORS
CORS_ORIGIN=https://your-domain.com
```

## Security Best Practices

1. **Never commit .env files** - Add to .gitignore
2. **Use strong secrets** - Generate with crypto.randomBytes
3. **Rotate secrets regularly** - Especially in production
4. **Use app-specific passwords** - For email services
5. **Restrict CORS origins** - Only allow your frontend domain
6. **Use HTTPS in production** - Secure all connections
7. **Limit file upload sizes** - Prevent abuse
8. **Use environment-specific configs** - Different values for dev/prod

## Validation

The application validates required environment variables on startup. Missing required variables will cause startup to fail with clear error messages.

## Troubleshooting

### "JWT_SECRET is required"
Set JWT_SECRET in .env file with at least 32 characters.

### "Database connection failed"
Check DATABASE_URL is correct and PostgreSQL is running.

### "AI service error"
Verify GROQ_API_KEY is valid or Ollama is running.

### "Email sending failed"
Check SMTP credentials and app-specific password for Gmail.
