# Testing Guide

This guide covers testing the AI Tracking Engine to ensure all features work correctly.

## Prerequisites

- Application running locally or deployed
- Sample documents uploaded
- Together AI API key configured

## Manual Testing Checklist

### 1. Document Upload ✓

**Test Case 1.1: Upload Markdown File**
1. Navigate to Query tab
2. Click upload area
3. Select `sample-docs/employee-handbook.md`
4. Verify success message appears
5. Check backend logs for processing

**Expected Result:**
- File uploads successfully
- Processing completes in <10 seconds
- No errors in console

**Test Case 1.2: Upload PDF File**
1. Create or use a sample PDF
2. Upload via interface
3. Verify processing

**Expected Result:**
- PDF parsed correctly
- Text extracted
- Chunks created and indexed

**Test Case 1.3: Invalid File Type**
1. Try uploading .txt or .docx file
2. Verify error message

**Expected Result:**
- Upload rejected
- Clear error message shown

### 2. Query System ✓

**Test Case 2.1: High Confidence Query**
1. Ask: "What are the standard working hours?"
2. Wait for response

**Expected Result:**
- Answer: "9:00 AM - 5:00 PM"
- Confidence: >70%
- Sources shown
- Response time: <3 seconds

**Test Case 2.2: Low Confidence Query**
1. Ask: "What is the company's quantum computing policy?"
2. Wait for response

**Expected Result:**
- Generic or uncertain answer
- Confidence: <70%
- Low confidence warning shown
- Query logged for review

**Test Case 2.3: Multiple Related Questions**
1. Ask: "How many vacation days do I get?"
2. Ask: "What is the leave policy?"
3. Ask: "How do I request time off?"

**Expected Result:**
- All questions answered
- Similar confidence scores
- Will cluster together in weekly report

### 3. Confidence Scoring ✓

**Test Case 3.1: Verify Score Calculation**
1. Ask a question with known answer in docs
2. Check confidence score
3. Verify it's between 0-100

**Expected Result:**
- Score calculated correctly
- Matches formula: 0.4*max + 0.3*avg + 0.3*llm
- Displayed with 1 decimal place

**Test Case 3.2: Source Quality Impact**
1. Ask question with exact match in docs
2. Ask question requiring inference

**Expected Result:**
- Exact match: Higher confidence (>80%)
- Inference: Lower confidence (<70%)

### 4. Dashboard ✓

**Test Case 4.1: View SOP Updates**
1. Navigate to Dashboard tab
2. Verify cards are displayed
3. Check all 4 columns visible

**Expected Result:**
- Cards grouped by status
- Priority colors visible
- Question counts shown
- Confidence scores displayed

**Test Case 4.2: Drag and Drop**
1. Drag a card from "To Update" to "In Progress"
2. Verify card moves
3. Refresh page

**Expected Result:**
- Card moves smoothly
- Status updates in database
- Change persists after refresh

**Test Case 4.3: Card Information**
1. Examine each card
2. Verify all fields present

**Expected Result:**
- Title
- Description
- Priority badge
- Question count
- Average confidence
- Assignee (if set)

### 5. Analytics ✓

**Test Case 5.1: Statistics Cards**
1. Navigate to Analytics tab
2. Check three stat cards

**Expected Result:**
- Total Queries: Correct count
- Avg Confidence: Calculated correctly
- Low Confidence: Count of queries <70%

**Test Case 5.2: Charts**
1. View weekly query volume chart
2. View confidence trend chart

**Expected Result:**
- Data displays correctly
- Charts are interactive
- Tooltips show on hover
- No rendering errors

**Test Case 5.3: Insights**
1. Check insights section
2. Verify recommendations

**Expected Result:**
- Insights based on data
- Actionable recommendations
- Color-coded by severity

### 6. Clustering ✓

**Test Case 6.1: Manual Clustering**
1. SSH into backend or use local terminal
2. Run: `cd backend && npm run cluster:weekly`
3. Check output

**Expected Result:**
- Clusters created
- Summaries generated
- SOP updates identified
- No errors

**Test Case 6.2: Cluster Quality**
1. Review created clusters
2. Check if similar questions grouped

**Expected Result:**
- Related questions in same cluster
- Meaningful cluster summaries
- Appropriate priority scores

### 7. API Endpoints ✓

**Test Case 7.1: Health Check**
```bash
curl http://localhost:5000/health
```

**Expected Result:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

**Test Case 7.2: Query Endpoint**
```bash
curl -X POST http://localhost:5000/api/query \
  -H "Content-Type: application/json" \
  -d '{"question": "What are working hours?"}'
```

**Expected Result:**
- 200 status code
- JSON response with answer, confidence, sources

**Test Case 7.3: Get SOPs**
```bash
curl http://localhost:5000/api/sop
```

**Expected Result:**
- Array of SOP updates
- All fields present
- Sorted by priority

### 8. Error Handling ✓

**Test Case 8.1: Invalid API Key**
1. Set wrong Together AI key
2. Try to query

**Expected Result:**
- Clear error message
- Doesn't crash
- Logged properly

**Test Case 8.2: Database Connection Lost**
1. Stop PostgreSQL
2. Try to query

**Expected Result:**
- Graceful error handling
- User-friendly message
- Automatic retry (if configured)

**Test Case 8.3: Qdrant Unavailable**
1. Stop Qdrant
2. Try to upload document

**Expected Result:**
- Error caught
- Clear message to user
- System remains stable

### 9. Performance ✓

**Test Case 9.1: Query Response Time**
1. Ask 10 different questions
2. Measure response times

**Expected Result:**
- Average: <2 seconds
- Max: <5 seconds
- Consistent performance

**Test Case 9.2: Document Upload Time**
1. Upload 10-page PDF
2. Measure processing time

**Expected Result:**
- Complete in <10 seconds
- Progress indication
- No timeout

**Test Case 9.3: Dashboard Load Time**
1. Clear cache
2. Navigate to Dashboard
3. Measure load time

**Expected Result:**
- Initial load: <1 second
- All data loaded: <2 seconds
- Smooth rendering

### 10. UI/UX ✓

**Test Case 10.1: Responsive Design**
1. Resize browser window
2. Test on mobile device

**Expected Result:**
- Layout adapts
- All features accessible
- No horizontal scroll
- Touch-friendly on mobile

**Test Case 10.2: Loading States**
1. Trigger various actions
2. Observe loading indicators

**Expected Result:**
- Loading spinners shown
- Buttons disabled during load
- Clear feedback to user

**Test Case 10.3: Error Messages**
1. Trigger various errors
2. Check error messages

**Expected Result:**
- Clear, user-friendly messages
- Actionable guidance
- Appropriate severity

## Automated Testing

### Backend Unit Tests
```bash
cd backend
npm test
```

**Expected Coverage:**
- Services: >80%
- Routes: >70%
- Utils: >90%

### Frontend Component Tests
```bash
cd frontend
npm test
```

**Expected Coverage:**
- Components: >70%
- Services: >80%
- Utils: >90%

## Integration Testing

### End-to-End Flow
1. Upload document
2. Wait for processing
3. Ask question about document
4. Verify answer is relevant
5. Check query logged
6. Run clustering
7. Verify SOP update created
8. Move card in dashboard
9. Check analytics updated

**Expected Result:**
- Complete flow works
- Data flows correctly
- No errors at any step

## Load Testing

### Concurrent Queries
```bash
# Use Apache Bench or similar
ab -n 100 -c 10 http://localhost:5000/api/query
```

**Expected Result:**
- Handles 10 concurrent requests
- No failures
- Reasonable response times

### Large Document Upload
1. Upload 100-page PDF
2. Monitor processing

**Expected Result:**
- Completes successfully
- Memory usage acceptable
- No timeouts

## Security Testing

### SQL Injection
1. Try SQL injection in query input
2. Verify sanitization

**Expected Result:**
- Input sanitized
- No SQL executed
- Error handled gracefully

### XSS Prevention
1. Try JavaScript in inputs
2. Verify escaping

**Expected Result:**
- Scripts not executed
- Content escaped
- Safe rendering

## Regression Testing

After any code changes:
1. Run all automated tests
2. Test core user flows
3. Check for console errors
4. Verify no performance degradation

## Bug Reporting Template

```markdown
**Bug Description:**
Clear description of the issue

**Steps to Reproduce:**
1. Step one
2. Step two
3. Step three

**Expected Behavior:**
What should happen

**Actual Behavior:**
What actually happens

**Environment:**
- OS: Windows/Mac/Linux
- Browser: Chrome/Firefox/Safari
- Node version: X.X.X
- Deployment: Local/Production

**Screenshots:**
Attach if applicable

**Logs:**
Relevant error logs
```

## Test Data

### Sample Questions
- "What are the working hours?"
- "How do I request vacation?"
- "What is the expense policy?"
- "How do I report a security incident?"
- "What equipment will I receive?"

### Expected Clusters
- Leave/vacation questions
- IT/equipment questions
- Security/policy questions
- Expense/reimbursement questions

## Success Criteria

✅ All manual tests pass
✅ Automated tests >80% coverage
✅ No critical bugs
✅ Performance within targets
✅ Security tests pass
✅ UI/UX smooth and intuitive

---

Run these tests before any release or major deployment!
