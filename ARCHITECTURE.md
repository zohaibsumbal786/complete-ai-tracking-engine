# Architecture Documentation

## System Overview

The AI Tracking Engine is a full-stack application that uses RAG (Retrieval Augmented Generation) to answer questions about company documentation and automatically identifies documentation gaps.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         Frontend                             │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐                  │
│  │  Query   │  │Dashboard │  │Analytics │                  │
│  │Interface │  │ (Kanban) │  │  Charts  │                  │
│  └──────────┘  └──────────┘  └──────────┘                  │
│                      React + TypeScript                      │
└────────────────────────┬────────────────────────────────────┘
                         │ REST API
┌────────────────────────┴────────────────────────────────────┐
│                      Backend API                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              Express.js Routes                        │  │
│  │  /query  /documents  /analytics  /sop                │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ RAG Service  │  │  Clustering  │  │  Document    │     │
│  │              │  │   Service    │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              AI Service (Together AI)                 │  │
│  │  - Embeddings Generation                             │  │
│  │  - LLM Completions                                   │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────┬──────────────────┬──────────────┬─────────────┘
             │                  │              │
    ┌────────┴────────┐  ┌─────┴──────┐  ┌───┴──────┐
    │   PostgreSQL    │  │   Qdrant   │  │Together  │
    │   (Metadata)    │  │  (Vectors) │  │   AI     │
    └─────────────────┘  └────────────┘  └──────────┘
```

## Component Details

### Frontend (React + TypeScript)

**Technology Stack:**
- React 18 with TypeScript
- Tailwind CSS for styling
- @dnd-kit for drag-and-drop
- Recharts for analytics visualization
- Axios for API calls

**Key Components:**

1. **QueryInterface**
   - Document upload
   - Question input
   - Answer display with confidence scores
   - Source citations

2. **Dashboard**
   - Kanban board with 4 columns
   - Drag-and-drop SOP cards
   - Real-time status updates
   - Priority indicators

3. **Analytics**
   - Statistics cards
   - Weekly trend charts
   - Confidence tracking
   - Automated insights

### Backend (Node.js + Express)

**Technology Stack:**
- Node.js with TypeScript
- Express.js for API
- PostgreSQL for relational data
- Qdrant for vector search
- Together AI for LLM/embeddings

**Services:**

1. **RAGService**
   - Query processing
   - Vector similarity search
   - Answer generation
   - Confidence calculation

2. **ClusteringService**
   - Question embedding
   - Similarity-based clustering
   - Cluster summarization
   - SOP gap identification

3. **DocumentService**
   - File parsing (PDF/Markdown)
   - Text chunking
   - Embedding generation
   - Vector storage

4. **AIService**
   - Together AI integration
   - Embedding generation
   - LLM completions
   - Batch processing

### Data Flow

#### Query Flow
```
1. User asks question
   ↓
2. Generate question embedding
   ↓
3. Search Qdrant for similar chunks
   ↓
4. Retrieve top 5 matching chunks
   ↓
5. Build context from chunks
   ↓
6. Send to LLM with context
   ↓
7. Calculate confidence score
   ↓
8. Log query to PostgreSQL
   ↓
9. Return answer to user
```

#### Document Upload Flow
```
1. User uploads PDF/Markdown
   ↓
2. Parse file content
   ↓
3. Store metadata in PostgreSQL
   ↓
4. Chunk text (500 words, 50 overlap)
   ↓
5. Generate embeddings for chunks
   ↓
6. Store vectors in Qdrant
   ↓
7. Return success to user
```

#### Weekly Clustering Flow
```
1. Cron job triggers (Monday 1 AM)
   ↓
2. Fetch queries from past week
   ↓
3. Generate embeddings for questions
   ↓
4. Cluster by similarity (threshold 0.75)
   ↓
5. Generate cluster summaries
   ↓
6. Calculate priority scores
   ↓
7. Create SOP update cards
   ↓
8. Store in PostgreSQL
```

## Database Schema

### PostgreSQL Tables

```sql
-- Document metadata
documents (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  content TEXT,
  file_path VARCHAR(500),
  uploaded_at TIMESTAMP,
  metadata JSONB
)

-- Query logs
queries (
  id SERIAL PRIMARY KEY,
  question TEXT,
  answer TEXT,
  confidence_score DECIMAL(5,2),
  user_id VARCHAR(100),
  timestamp TIMESTAMP,
  metadata JSONB
)

-- Question clusters
question_clusters (
  id SERIAL PRIMARY KEY,
  week_start DATE,
  cluster_label VARCHAR(255),
  question_ids INTEGER[],
  avg_confidence DECIMAL(5,2),
  question_count INTEGER,
  summary TEXT,
  created_at TIMESTAMP
)

-- SOP updates
sop_updates (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255),
  description TEXT,
  cluster_id INTEGER REFERENCES question_clusters(id),
  priority VARCHAR(20),
  status VARCHAR(20),
  assignee VARCHAR(100),
  question_count INTEGER,
  avg_confidence DECIMAL(5,2),
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)
```

### Qdrant Collections

```
documents (
  vector: float[768],  // m2-bert-80M-8k-retrieval
  payload: {
    doc_id: integer,
    title: string,
    text: string,
    chunk_index: integer
  }
)
```

## Algorithms

### Confidence Score Calculation

```javascript
confidence = (
  0.4 * max_chunk_similarity +      // Best matching chunk
  0.3 * avg_top3_similarity +       // Average of top 3
  0.3 * llm_confidence              // LLM self-assessment
) * 100
```

**Rationale:**
- Best match (40%): Most important signal
- Top 3 average (30%): Consistency check
- LLM confidence (30%): Self-assessment

### Priority Score Calculation

```javascript
priority = (
  question_frequency * 0.4 +        // How often asked
  (100 - avg_confidence) * 0.4 +    // How poorly answered
  business_impact * 0.2             // Manual importance
)

if (priority > 70) → high
else if (priority > 40) → medium
else → low
```

### Clustering Algorithm

1. Generate embeddings for all questions
2. Calculate pairwise cosine similarity
3. Group questions with similarity > 0.75
4. Generate summary for each cluster using LLM

## API Endpoints

### Query Endpoints
- `POST /api/query` - Ask a question
- `GET /api/query/low-confidence` - Get low confidence queries

### Document Endpoints
- `POST /api/documents/upload` - Upload document
- `GET /api/documents` - List all documents
- `DELETE /api/documents/:id` - Delete document

### Analytics Endpoints
- `POST /api/analytics/cluster` - Trigger clustering
- `GET /api/analytics/clusters` - Get clusters
- `GET /api/analytics/stats` - Get statistics

### SOP Endpoints
- `GET /api/sop` - Get all SOP updates
- `GET /api/sop/by-status` - Get SOPs grouped by status
- `PATCH /api/sop/:id` - Update SOP status/assignee

## Security Considerations

1. **API Keys**: Stored in environment variables
2. **Database**: SSL connections in production
3. **File Uploads**: Type validation, size limits
4. **CORS**: Configured for specific origins
5. **Rate Limiting**: Recommended for production
6. **Input Validation**: Zod schemas for all inputs

## Performance Optimization

1. **Caching**: Cache frequent queries
2. **Batch Processing**: Embeddings generated in batches
3. **Indexing**: Database indexes on frequently queried fields
4. **Connection Pooling**: PostgreSQL connection pool
5. **Lazy Loading**: Frontend components load on demand

## Scalability

### Current Limits (Free Tier)
- 1GB vector storage (Qdrant)
- 10,000 queries/month
- 100GB bandwidth (Vercel)

### Scaling Strategy
1. Upgrade Qdrant for more storage
2. Add Redis for caching
3. Implement CDN for static assets
4. Use read replicas for database
5. Add load balancer for multiple backend instances

## Monitoring

### Key Metrics
- Query response time
- Confidence score distribution
- API error rates
- Database query performance
- Vector search latency

### Logging
- Winston for structured logging
- Log levels: error, warn, info, debug
- Logs include timestamps and context

## Future Enhancements

1. **User Authentication**: Add login/signup
2. **Real-time Updates**: WebSocket for live dashboard
3. **Advanced Analytics**: ML-based trend prediction
4. **Multi-language**: Support multiple languages
5. **API Rate Limiting**: Protect against abuse
6. **Automated Testing**: Comprehensive test suite
7. **CI/CD Pipeline**: Automated deployment
8. **Feedback Loop**: User ratings on answers

---

This architecture is designed to be:
- **Scalable**: Easy to add more resources
- **Maintainable**: Clear separation of concerns
- **Cost-effective**: Runs on free tiers
- **Extensible**: Easy to add new features
