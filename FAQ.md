# Frequently Asked Questions (FAQ)

## General Questions

### What is the AI Tracking Engine?
A system that uses AI to answer questions about company documentation, automatically identifies knowledge gaps, and helps prioritize documentation updates.

### Is it really free?
Yes! It runs entirely on free tier services:
- Together AI: $25 free credit
- Vercel: Free hosting
- Railway: $5/month credit
- Qdrant Cloud: 1GB free
- Supabase: 500MB free

### How accurate are the answers?
Accuracy depends on your documentation quality. The system provides confidence scores (0-100%) to indicate reliability. Answers with >70% confidence are generally accurate.

### What file formats are supported?
- PDF documents
- Markdown (.md) files

### Can I use my own AI models?
Yes! The code is modular. You can swap Together AI for:
- OpenAI
- Anthropic Claude
- Groq
- Local models (Ollama)

## Setup Questions

### Do I need Docker?
No, but it's recommended. You can run PostgreSQL and Qdrant separately if needed.

### What if I don't have a Together AI key?
You can use alternative providers:
- OpenAI (paid)
- Groq (free tier)
- Hugging Face (free)
- Local models with Ollama

### How long does setup take?
- With Docker: 15-20 minutes
- Manual setup: 30-45 minutes

### Can I run this on Windows?
Yes! Use the `scripts/setup.bat` file or Docker Desktop for Windows.

### What are the minimum system requirements?
- 4GB RAM
- 10GB disk space
- Node.js 18+
- Modern browser

## Usage Questions

### How do I upload documents?
1. Go to Query tab
2. Click the upload area
3. Select PDF or Markdown file
4. Wait for processing (5-10 seconds)

### Why is my confidence score low?
Low confidence (<70%) means:
- Question not well covered in docs
- Ambiguous documentation
- Question requires inference
- Documentation needs updating

### How does clustering work?
Every week (or manually), the system:
1. Groups similar questions
2. Generates summaries
3. Identifies documentation gaps
4. Creates SOP update cards

### Can I customize the confidence formula?
Yes! Edit `backend/src/services/rag.service.ts`:
```typescript
const confidence = (
  0.4 * maxSimilarity +
  0.3 * avgTop3 +
  0.3 * llmConfidence
) * 100;
```

### How do I run clustering manually?
```bash
cd backend
npm run cluster:weekly
```

## Technical Questions

### What database does it use?
- PostgreSQL for metadata (queries, clusters, SOPs)
- Qdrant for vector embeddings

### How are embeddings generated?
Using Together AI's `m2-bert-80M-8k-retrieval` model (768 dimensions).

### What LLM is used?
Default: `meta-llama/Llama-3-8b-chat-hf` from Together AI.

### Can I change the chunk size?
Yes! Edit `backend/src/services/document.service.ts`:
```typescript
chunkText(text, chunkSize = 500, overlap = 50)
```

### How is similarity calculated?
Cosine similarity between question and document chunk embeddings.

### What's the vector dimension?
768 (for m2-bert-80M-8k-retrieval model).

## Deployment Questions

### Where should I deploy?
Recommended:
- Frontend: Vercel
- Backend: Railway
- Database: Supabase
- Vector DB: Qdrant Cloud

### How much will it cost at scale?
Estimates for 50,000 queries/month:
- Together AI: ~$20/month
- Railway: ~$10/month
- Qdrant: ~$25/month
- Total: ~$55/month

### Can I self-host everything?
Yes! Use Docker Compose on any VPS. Recommended: 2GB RAM, 20GB disk.

### How do I setup HTTPS?
Use a reverse proxy (nginx) with Let's Encrypt:
```nginx
server {
    listen 443 ssl;
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
    }
}
```

### How do I backup data?
```bash
# PostgreSQL
pg_dump $DATABASE_URL > backup.sql

# Qdrant
# Use Qdrant Cloud automatic backups
```

## Troubleshooting

### "Cannot connect to database"
1. Check PostgreSQL is running: `docker ps`
2. Verify DATABASE_URL in .env
3. Test connection: `psql $DATABASE_URL`

### "Qdrant connection failed"
1. Check Qdrant is running: `curl http://localhost:6333/health`
2. Verify QDRANT_URL in .env
3. Restart: `docker restart qdrant`

### "Together AI API error"
1. Check API key is correct
2. Verify you have credits: https://api.together.xyz/
3. Check rate limits

### "Low confidence on all queries"
1. Upload more comprehensive documentation
2. Ensure documents are well-structured
3. Check embeddings are generating correctly
4. Verify LLM is responding

### "Frontend can't reach backend"
1. Check backend is running: `curl http://localhost:5000/health`
2. Verify VITE_API_URL in frontend/.env
3. Check CORS settings in backend
4. Look for errors in browser console

### "Clustering produces no results"
1. Ensure you have queries in database
2. Check date range is correct
3. Verify embeddings are generated
4. Look at backend logs

### "Drag and drop not working"
1. Clear browser cache
2. Check for JavaScript errors
3. Verify @dnd-kit is installed
4. Try different browser

### "Upload fails"
1. Check file size (<10MB recommended)
2. Verify file format (PDF or MD)
3. Check uploads/ directory exists
4. Look at backend logs

## Performance Questions

### How can I make queries faster?
1. Add Redis caching
2. Use smaller embedding model
3. Reduce chunk size
4. Optimize database queries
5. Add CDN for frontend

### How many documents can I upload?
Limited by:
- Qdrant storage (1GB free = ~10,000 documents)
- Database size
- Processing time

### Can it handle concurrent users?
Yes! Default setup handles:
- 10-20 concurrent users
- 100+ queries/minute
- Scale by adding more backend instances

### How do I monitor performance?
1. Check backend logs
2. Use Railway/Vercel metrics
3. Add APM tool (New Relic, DataDog)
4. Monitor database queries

## Feature Questions

### Can I add user authentication?
Yes! Recommended approaches:
- Supabase Auth
- Auth0
- NextAuth.js
- Custom JWT

### Can I integrate with Slack?
Yes! Create a Slack bot that:
1. Receives questions
2. Calls query API
3. Returns answers

### Can I export data?
Yes! Use PostgreSQL export:
```bash
psql $DATABASE_URL -c "COPY queries TO '/tmp/queries.csv' CSV HEADER"
```

### Can I customize the UI?
Absolutely! Edit React components in `frontend/src/components/`.

### Can I add more languages?
Yes! The system supports any language that:
- Together AI can process
- Has embedding models available

## Best Practices

### Documentation Tips
- Use clear headings
- Include examples
- Keep sections focused
- Update regularly
- Use consistent formatting

### Query Tips
- Be specific
- Use keywords from docs
- Ask one thing at a time
- Rephrase if low confidence

### Maintenance Tips
- Run clustering weekly
- Review low confidence queries
- Update documentation regularly
- Monitor API usage
- Backup data monthly

## Getting Help

### Where can I get support?
1. Check this FAQ
2. Read documentation (README, SETUP, etc.)
3. Search GitHub issues
4. Open new issue with details
5. Check logs for errors

### How do I report a bug?
1. Go to GitHub Issues
2. Use bug report template
3. Include steps to reproduce
4. Attach logs and screenshots
5. Specify environment details

### How do I request a feature?
1. Open GitHub Issue
2. Describe use case
3. Explain expected behavior
4. Provide mockups if UI change

### Can I contribute?
Yes! See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## Advanced Questions

### Can I train custom models?
Yes, but requires:
- Training data
- GPU resources
- ML expertise
- Model hosting

### Can I use multiple LLMs?
Yes! Modify AIService to route to different models based on:
- Question type
- Confidence threshold
- Cost optimization

### Can I add RAG evaluation?
Yes! Implement:
- RAGAS metrics
- Human feedback loop
- A/B testing
- Confidence calibration

### Can I scale horizontally?
Yes! Add:
- Load balancer
- Multiple backend instances
- Read replicas for database
- Redis for session management

---

Still have questions? Open an issue on GitHub!
