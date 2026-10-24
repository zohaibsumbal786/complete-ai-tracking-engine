# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication

All endpoints except `/auth/login` and `/auth/register` require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "John Doe"
}
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "name": "John Doe",
    "role": "recruiter"
  },
  "token": "jwt_token_here"
}
```

#### POST /auth/login
Login with credentials.

**Request:**
```json
{
  "email": "admin@recruitment.ai",
  "password": "admin123"
}
```

**Response:**
```json
{
  "user": { "id": 1, "email": "...", "name": "...", "role": "admin" },
  "token": "jwt_token_here"
}
```

### Jobs

#### GET /jobs
Get all jobs with applicant counts.

#### POST /jobs
Create a new job.

**Request:**
```json
{
  "title": "Senior Developer",
  "description": "Job description...",
  "salary_min": 80000,
  "salary_max": 120000,
  "requirements": {
    "skills": ["React", "Node.js"],
    "experience": "5+ years"
  }
}
```

#### PUT /jobs/:id
Update a job.

#### DELETE /jobs/:id
Delete a job.

### Candidates

#### POST /candidates/upload-cv
Upload and parse a CV.

**Request:** multipart/form-data
- `cv`: File (PDF, DOC, DOCX, TXT)
- `jobId`: (optional) Job ID to apply to

**Response:**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "parsed_data": { ... },
  "bias_free_profile": { ... }
}
```

#### GET /candidates
Get all candidates.

Query params:
- `status`: Filter by status
- `search`: Search by name or email

#### GET /candidates/:id
Get candidate details.

#### PUT /candidates/:id
Update candidate.

#### DELETE /candidates/:id
Delete candidate.

### Applications

#### GET /applications
Get all applications.

Query params:
- `jobId`: Filter by job
- `status`: Filter by status

#### POST /applications
Create application.

**Request:**
```json
{
  "candidateId": 1,
  "jobId": 1
}
```

#### PUT /applications/:id/status
Update application status.

**Request:**
```json
{
  "status": "interview_scheduled",
  "notes": "Optional notes"
}
```

### Screening

#### POST /screening/generate-questions
Generate AI screening questions for a job.

**Request:**
```json
{
  "jobId": 1
}
```

**Response:**
```json
[
  {
    "id": 1,
    "question_text": "What is React?",
    "question_type": "multiple_choice",
    "options": ["A", "B", "C", "D"],
    "correct_answer": "A",
    "points": 10
  }
]
```

#### GET /screening/questions/:jobId
Get screening questions for a job.

#### POST /screening/submit-answers
Submit candidate answers.

**Request:**
```json
{
  "applicationId": 1,
  "answers": [
    { "questionId": 1, "answer": "A" },
    { "questionId": 2, "answer": "B" }
  ]
}
```

### Interviews

#### POST /interviews/schedule
Schedule an interview.

**Request:**
```json
{
  "applicationId": 1,
  "scheduledAt": "2024-12-25T10:00:00Z",
  "meetingLink": "https://meet.google.com/abc-defg-hij",
  "interviewerId": 1
}
```

#### GET /interviews
Get all interviews.

Query params:
- `status`: Filter by status
- `upcoming`: "true" for upcoming only

#### PUT /interviews/:id
Update interview.

#### DELETE /interviews/:id
Delete interview.

### Analytics

#### GET /analytics/dashboard
Get dashboard analytics.

**Response:**
```json
{
  "totalApplications": 107,
  "applicationsByStatus": [
    { "status": "applied", "count": 50 },
    { "status": "screening_completed", "count": 24 }
  ],
  "activeJobs": 5,
  "averageTimeToHire": 14.5,
  "applicationsByJob": [
    { "title": "Senior Developer", "count": 45 }
  ]
}
```

#### GET /analytics/reports
Get detailed reports.

Query params:
- `startDate`: Start date (YYYY-MM-DD)
- `endDate`: End date (YYYY-MM-DD)

## Error Responses

All errors follow this format:

```json
{
  "error": "Error message here"
}
```

Common status codes:
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
