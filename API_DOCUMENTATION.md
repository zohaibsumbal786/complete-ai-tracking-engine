# 📡 API Documentation

Complete API reference for the AI Tracking Engine backend.

## Base URL

```
Development: http://localhost:5000
Production:  https://your-domain.com
```

## Authentication

Currently, the API is open. To add authentication:
- Use Supabase Auth
- Implement JWT tokens
- Add API keys

---

## Endpoints

### Health Check

#### GET /health

Check if the API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Query Endpoints

### Ask a Question

#### POST /api/query

Submit a question and get an AI-powered answer.

**Request Body:**
```json
{
  "question": "What are the working hours?",
  "userId": "user123" // optional
}
```

**Response:**
```json
{
  "answer": "Standard working hours are 9:00 AM - 5:00 PM...",
  "confidence": 87.3,
  "sources": [
    {
      "id": 1,
      "title": "Employee Handbook",
      "snippet": "Working hours: 9:00 AM - 5:00 PM..."
    }
  ]
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid request
- `500` - Server error

### Get Low Confidence Queries

#### GET /api/query/low-confidence

Retrieve queries with confidence below threshold.

**Query Parameters:**
- `threshold` (optional) - Confidence threshold (default: 70)

**Example:**
```
GET /api/query/low-confidence?threshold=70
```

**Response:**
```json
[
  {
    "id": 123,
    "question": "What is the quantum computing policy?",
    "answer": "I don't have specific information...",
    "confidence_score": 45.2,
    "timestamp": "2024-01-15T10:30:00.000Z"
  }
]
```

---

## Document Endpoints

### Upload Document

#### POST /api/documents/upload

Upload a PDF or Markdown document.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `file` (required) - PDF or Markdown file
  - `title` (optional) - Document title

**Example (curl):**
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@handbook.pdf" \
  -F "title=Employee Handbook"
```

**Response:**
```json
{
  "id": 1,
  "message": "Document uploaded successfully"
}
```

**Status Codes:**
- `200` - Success
- `400` - Invalid file or missing file
- `500` - Processing error

### List Documents

#### GET /api/documents

Get all uploaded documents.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Employee Handbook",
    "uploaded_at": "2024-01-15T10:30:00.000Z",
    "metadata": {
      "fileType": "pdf"
    }
  }
]
```

### Delete Document

#### DELETE /api/documents/:id

Delete a document and its embeddings.

**Parameters:**
- `id` - Document ID

**Example:**
```
DELETE /api/documents/1
```

**Response:**
```json
{
  "message": "Document deleted successfully"
}
```

---

## Analytics Endpoints

### Trigger Clustering

#### POST /api/analytics/cluster

Manually trigger question clustering.

**Request Body:**
```json
{
  "weekStart": "2024-01-15" // optional, defaults to current week
}
```

**Response:**
```json
{
  "clusters": [
    {
      "id": 1,
      "questions": [...],
      "avgConfidence": 65.4,
      "summary": "Questions about leave policy"
    }
  ],
  "count": 5
}
```

### Get Clusters

#### GET /api/analytics/clusters

Retrieve clusters for a specific week.

**Query Parameters:**
- `weekStart` (optional) - Week start date (YYYY-MM-DD)

**Example:**
```
GET /api/analytics/clusters?weekStart=2024-01-15
```

**Response:**
```json
[
  {
    "id": 1,
    "week_start": "2024-01-15",
    "cluster_label": "Leave Policy Questions",
    "question_ids": [1, 2, 3],
    "avg_confidence": 65.4,
    "question_count": 3,
    "summary": "Questions about vacation and sick leave",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Statistics

#### GET /api/analytics/stats

Get overall and weekly statistics.

**Response:**
```json
{
  "overall": {
    "total_queries": "1234",
    "avg_confidence": "75.6",
    "low_confidence_count": "123"
  },
  "weekly": [
    {
      "week": "2024-01-15T00:00:00.000Z",
      "query_count": "234",
      "avg_confidence": "76.2"
    }
  ]
}
```

---

## SOP Endpoints

### Get All SOPs

#### GET /api/sop

Retrieve all SOP update cards.

**Response:**
```json
[
  {
    "id": 1,
    "title": "Update Leave Policy",
    "description": "Questions about vacation days",
    "cluster_id": 1,
    "priority": "high",
    "status": "to_update",
    "assignee": "john@company.com",
    "question_count": 15,
    "avg_confidence": 62.3,
    "created_at": "2024-01-15T10:30:00.000Z",
    "updated_at": "2024-01-15T10:30:00.000Z",
    "cluster_summary": "Questions about leave policy"
  }
]
```

### Update SOP

#### PATCH /api/sop/:id

Update SOP status, assignee, or priority.

**Parameters:**
- `id` - SOP ID

**Request Body:**
```json
{
  "status": "in_progress",      // optional
  "assignee": "jane@company.com", // optional
  "priority": "high"             // optional
}
```

**Example:**
```bash
curl -X PATCH http://localhost:5000/api/sop/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress","assignee":"jane@company.com"}'
```

**Response:**
```json
{
  "id": 1,
  "title": "Update Leave Policy",
  "status": "in_progress",
  "assignee": "jane@company.com",
  "updated_at": "2024-01-15T11:00:00.000Z"
}
```

### Get SOPs by Status

#### GET /api/sop/by-status

Get SOPs grouped by status (for Kanban board).

**Response:**
```json
{
  "to_update": [
    {
      "id": 1,
      "title": "Update Leave Policy",
      ...
    }
  ],
  "in_progress": [
    {
      "id": 2,
      "title": "Update IT Security",
      ...
    }
  ],
  "in_review": [],
  "done": []
}
```

---

## Error Responses

All endpoints may return these error responses:

### 400 Bad Request
```json
{
  "error": "Invalid request",
  "message": "Question is required"
}
```

### 404 Not Found
```json
{
  "error": "Not found",
  "message": "SOP update not found"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Failed to process document"
}
```

---

## Rate Limiting

Currently no rate limiting. For production, consider:
- 100 requests per minute per IP
- 1000 requests per hour per user
- Use Redis for tracking

---

## CORS

CORS is enabled for all origins in development.

For production, configure in `backend/src/index.ts`:
```typescript
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## Data Types

### Query
```typescript
interface Query {
  id: number;
  question: string;
  answer: string;
  confidence_score: number;
  user_id?: string;
  timestamp: Date;
  metadata?: object;
}
```

### Document
```typescript
interface Document {
  id: number;
  title: string;
  content: string;
  file_path?: string;
  uploaded_at: Date;
  metadata?: object;
}
```

### Cluster
```typescript
interface Cluster {
  id: number;
  week_start: Date;
  cluster_label: string;
  question_ids: number[];
  avg_confidence: number;
  question_count: number;
  summary: string;
  created_at: Date;
}
```

### SOPUpdate
```typescript
interface SOPUpdate {
  id: number;
  title: string;
  description?: string;
  cluster_id?: number;
  priority: 'low' | 'medium' | 'high';
  status: 'to_update' | 'in_progress' | 'in_review' | 'done';
  assignee?: string;
  question_count: number;
  avg_confidence: number;
  created_at: Date;
  updated_at: Date;
}
```

---

## Examples

### Complete Workflow

#### 1. Upload Document
```bash
curl -X POST http://localhost:5000/api/documents/upload \
  -F "file=@handbook.pdf"
```

#### 2. Ask Question
```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question":"What are working hours?"}'
```

#### 3. Check Low Confidence
```bash
curl http://localhost:5000/api/query/low-confidence?threshold=70
```

#### 4. Run Clustering
```bash
curl -X POST http://localhost:5000/api/analytics/cluster \
  -H "Content-Type: application/json" \
  -d '{}'
```

#### 5. Get SOPs
```bash
curl http://localhost:5000/api/sop/by-status
```

#### 6. Update SOP
```bash
curl -X PATCH http://localhost:5000/api/sop/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"in_progress"}'
```

---

## Testing

### Using curl

```bash
# Health check
curl http://localhost:5000/health

# Ask question
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question":"test"}'

# Get stats
curl http://localhost:5000/api/analytics/stats
```

### Using Postman

1. Import collection from `postman_collection.json` (if provided)
2. Set base URL to `http://localhost:5000`
3. Test each endpoint

### Using JavaScript

```javascript
// Ask question
const response = await fetch('http://localhost:5000/api/query', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ question: 'What are working hours?' })
});
const data = await response.json();
console.log(data);
```

---

## Webhooks (Future)

Plan to add webhooks for:
- New low confidence query
- Weekly clustering complete
- SOP status changed

---

## API Versioning

Current version: v1 (implicit)

Future versions will use:
- `/api/v2/query`
- `/api/v2/documents`

---

## Security Best Practices

1. **Add Authentication**
   - JWT tokens
   - API keys
   - OAuth

2. **Rate Limiting**
   - Per IP
   - Per user
   - Per endpoint

3. **Input Validation**
   - Already using Zod
   - Sanitize inputs
   - Validate file types

4. **HTTPS Only**
   - Force HTTPS in production
   - Use secure cookies
   - HSTS headers

5. **CORS**
   - Whitelist domains
   - Credentials handling
   - Preflight requests

---

## Performance Tips

1. **Caching**
   - Cache frequent queries
   - Use Redis
   - Set TTL appropriately

2. **Pagination**
   - Add to list endpoints
   - Default: 50 items
   - Max: 100 items

3. **Compression**
   - Enable gzip
   - Compress responses
   - Reduce payload size

4. **Database**
   - Use indexes
   - Connection pooling
   - Query optimization

---

## Support

For API issues:
1. Check [FAQ.md](./FAQ.md)
2. Review error messages
3. Check backend logs
4. Open GitHub issue

---

**API Version:** 1.0.0  
**Last Updated:** January 2024  
**Status:** Production Ready
