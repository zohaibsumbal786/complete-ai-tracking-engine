# System Architecture

## Overview

The AI Recruitment Pipeline is a full-stack web application built with modern technologies and best practices.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  React + TypeScript + Tailwind CSS                   │  │
│  │  - Component-based UI                                │  │
│  │  - State management (Zustand)                        │  │
│  │  - API client (Axios)                                │  │
│  │  - React Query for data fetching                     │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ HTTP/REST API
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                         Backend                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Node.js + Express + TypeScript                      │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Routes Layer                                   │  │  │
│  │  │  - Auth, Jobs, Candidates, Applications        │  │  │
│  │  │  - Screening, Interviews, Analytics            │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Middleware Layer                              │  │  │
│  │  │  - Authentication (JWT)                        │  │  │
│  │  │  - Authorization                               │  │  │
│  │  │  - File upload (Multer)                        │  │  │
│  │  │  - Error handling                              │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  │  ┌────────────────────────────────────────────────┐  │  │
│  │  │  Services Layer                                │  │  │
│  │  │  - AI Service (CV parsing, questions)          │  │  │
│  │  │  - Email Service (notifications)               │  │  │
│  │  │  - CV Parser Service                           │  │  │
│  │  └────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
┌──────────────────────────┐  ┌──────────────────────────┐
│     PostgreSQL DB        │  │    External Services     │
│  - Users                 │  │  - Groq API (AI)         │
│  - Jobs                  │  │  - Gmail SMTP            │
│  - Candidates            │  │  - Google Calendar       │
│  - Applications          │  │  - Ollama (optional)     │
│  - Screening Questions   │  │                          │
│  - Interviews            │  │                          │
│  - Audit Logs            │  │                          │
└──────────────────────────┘  └──────────────────────────┘
```

## Technology Stack

### Frontend
- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **Tailwind CSS**: Utility-first CSS
- **React Router**: Client-side routing
- **TanStack Query**: Server state management
- **Zustand**: Client state management
- **Axios**: HTTP client
- **Recharts**: Data visualization
- **React Dropzone**: File uploads
- **Lucide React**: Icons

### Backend
- **Node.js 18**: Runtime
- **Express**: Web framework
- **TypeScript**: Type safety
- **PostgreSQL**: Database
- **pg**: PostgreSQL client
- **JWT**: Authentication
- **bcryptjs**: Password hashing
- **Multer**: File uploads
- **pdf-parse**: PDF parsing
- **mammoth**: DOCX parsing
- **Nodemailer**: Email sending
- **ics**: Calendar events
- **Groq SDK**: AI integration
- **Zod**: Schema validation

### AI/ML
- **Groq API**: Fast LLM inference (Llama 3.1 70B)
- **Ollama**: Local LLM option
- **Custom prompts**: CV parsing, question generation

### Infrastructure
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration
- **Nginx**: Reverse proxy and static file serving
- **PostgreSQL**: Relational database

## Data Flow

### 1. CV Upload & Parsing

```
User uploads CV
    ↓
Frontend sends file to /api/candidates/upload-cv
    ↓
Backend receives file (Multer middleware)
    ↓
CV Parser Service extracts text
    ↓
AI Service sends text to Groq/Ollama
    ↓
AI returns structured JSON
    ↓
Bias removal applied
    ↓
Candidate created in database
    ↓
Response sent to frontend
```

### 2. Screening Question Generation

```
User clicks "Generate Questions"
    ↓
Frontend sends job ID to /api/screening/generate-questions
    ↓
Backend fetches job details
    ↓
AI Service creates prompt with job requirements
    ↓
Groq/Ollama generates questions
    ↓
Questions saved to database
    ↓
Response sent to frontend
```

### 3. Interview Scheduling

```
User schedules interview
    ↓
Frontend sends data to /api/interviews/schedule
    ↓
Backend creates interview record
    ↓
Email Service generates calendar invite (.ics)
    ↓
Email sent via Gmail SMTP
    ↓
Application status updated
    ↓
Response sent to frontend
```

## Database Schema

### Entity Relationship

```
users (1) ──────< (many) jobs
                    │
                    │ (many)
                    ▼
                applications (many) ──────> (1) candidates
                    │
                    │ (many)
                    ├──────> (many) candidate_answers
                    │
                    └──────> (many) interviews

jobs (1) ──────< (many) screening_questions
                    │
                    │ (many)
                    ▼
                candidate_answers

audit_logs ──────> users
audit_logs ──────> candidates
```

### Key Tables

**users**: Recruiters and admins  
**jobs**: Job postings  
**candidates**: Candidate profiles  
**applications**: Job applications  
**screening_questions**: AI-generated questions  
**candidate_answers**: Screening responses  
**interviews**: Scheduled interviews  
**audit_logs**: Compliance tracking  

## Security Architecture

### Authentication Flow

```
1. User submits credentials
2. Backend validates against database
3. JWT token generated with user info
4. Token sent to frontend
5. Frontend stores in localStorage
6. Token included in all API requests
7. Backend validates token on each request
```

### Security Layers

1. **Transport Security**: HTTPS in production
2. **Authentication**: JWT tokens
3. **Authorization**: Role-based access control
4. **Input Validation**: Zod schemas
5. **SQL Injection**: Parameterized queries
6. **XSS Protection**: React auto-escaping
7. **File Upload**: Type and size validation
8. **Rate Limiting**: Prevent abuse
9. **Audit Logging**: Track all actions

## API Architecture

### RESTful Design

```
GET    /api/resource      - List all
GET    /api/resource/:id  - Get one
POST   /api/resource      - Create
PUT    /api/resource/:id  - Update
DELETE /api/resource/:id  - Delete
```

### Response Format

Success:
```json
{
  "data": { ... }
}
```

Error:
```json
{
  "error": "Error message"
}
```

### Status Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Server Error

## Deployment Architecture

### Development

```
localhost:5173 (Frontend - Vite)
    ↓
localhost:3000 (Backend - Express)
    ↓
localhost:5432 (PostgreSQL)
```

### Production (Docker)

```
Port 80 (Nginx)
    ├── / → Frontend (static files)
    └── /api → Backend (proxy)
            ↓
        Backend Container
            ↓
        PostgreSQL Container
```

### Scaling Strategy

1. **Horizontal Scaling**: Multiple backend instances behind load balancer
2. **Database**: Read replicas for queries
3. **Caching**: Redis for session and data caching
4. **CDN**: Static assets on CDN
5. **File Storage**: S3 or similar for uploads
6. **Queue**: Bull/Redis for background jobs

## Performance Optimizations

### Frontend
- Code splitting
- Lazy loading
- Image optimization
- Bundle size optimization
- React Query caching
- Debounced search

### Backend
- Database indexing
- Connection pooling
- Query optimization
- Response compression
- Caching headers
- Async operations

### Database
- Indexes on foreign keys
- Indexes on search fields
- Query optimization
- Connection pooling
- Prepared statements

## Monitoring & Logging

### Application Logs
- Request/response logging
- Error logging
- Performance metrics
- User actions

### Database Logs
- Query performance
- Slow queries
- Connection stats

### Infrastructure Logs
- Container health
- Resource usage
- Network traffic

## Backup Strategy

### Database Backups
- Daily automated backups
- Point-in-time recovery
- Backup retention: 30 days
- Backup testing: Weekly

### File Backups
- Uploaded CVs backed up
- Backup to S3 or similar
- Retention: 90 days

## Disaster Recovery

1. **Database**: Restore from latest backup
2. **Files**: Restore from S3
3. **Application**: Redeploy from Git
4. **RTO**: 1 hour
5. **RPO**: 24 hours

## Future Architecture Enhancements

1. **Microservices**: Split into smaller services
2. **Event-Driven**: Use message queue (RabbitMQ/Kafka)
3. **GraphQL**: Alternative to REST API
4. **WebSockets**: Real-time updates
5. **Kubernetes**: Container orchestration
6. **Service Mesh**: Istio for microservices
7. **Serverless**: AWS Lambda for background jobs
8. **ML Pipeline**: Custom model training
