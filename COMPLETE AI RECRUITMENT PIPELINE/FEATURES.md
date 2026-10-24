# Features Documentation

## Core Features

### 1. AI-Powered CV Parsing

**What it does:**
- Automatically extracts structured information from uploaded CVs
- Supports PDF, DOC, DOCX, and TXT formats
- Uses AI to understand and categorize information

**Extracted Information:**
- Personal details (name, email, phone)
- Work experience (company, role, duration, responsibilities)
- Education (degree, institution, year)
- Skills (technical and soft skills)
- Certifications
- Languages

**How to use:**
1. Navigate to Candidates page
2. Click "Upload CV"
3. Select job position (optional)
4. Drag & drop or select CV file
5. AI automatically parses and creates candidate profile

**Technical Details:**
- Uses Groq API (Llama 3.1 70B) or local Ollama
- Extracts text from documents using pdf-parse and mammoth
- Structured JSON output with validation
- Automatic retry on parsing failures

### 2. Bias-Free Screening

**What it does:**
- Removes identifying information during initial screening
- Ensures fair evaluation based on qualifications only
- Maintains audit trail for compliance

**Removed Information:**
- Name
- Photo
- Age/Date of birth
- Gender
- Address
- Ethnicity indicators

**How it works:**
1. CV is parsed into full profile
2. Bias-free version is automatically created
3. Initial screening uses anonymized profile
4. Identity revealed only after screening threshold
5. All access logged in audit trail

**Benefits:**
- Reduces unconscious bias
- Improves diversity
- Ensures compliance with equal opportunity laws
- Provides audit trail for legal protection

### 3. Automated Screening Questions

**What it does:**
- AI generates relevant screening questions based on job requirements
- Creates multiple choice, short answer, and technical questions
- Automatic scoring system

**Question Types:**
- Multiple choice (auto-scored)
- Short answer (manual review)
- Technical challenges (for developer roles)
- Behavioral questions

**How to use:**
1. Create or select a job
2. Click "Generate Questions"
3. AI creates 10 relevant questions
4. Review and edit if needed
5. Questions automatically sent to applicants

**Customization:**
- Edit generated questions
- Add custom questions
- Set point values
- Define correct answers
- Create question templates

### 4. Interview Scheduling

**What it does:**
- Automated interview scheduling with calendar integration
- Email invitations with calendar events
- Timezone handling
- Reminder system

**Features:**
- Calendar availability detection
- Automated slot suggestions
- Email invitations with .ics files
- Google Calendar sync
- Meeting link generation
- Reminder emails (24hrs, 1hr before)
- Rescheduling functionality

**How to use:**
1. Go to Interviews page
2. Click "Schedule Interview"
3. Select candidate
4. Choose date/time
5. Add meeting link
6. System sends email with calendar invite

**Integrations:**
- Google Calendar
- Zoom
- Google Meet
- Microsoft Teams

### 5. Real-Time Dashboard

**What it displays:**
- Total applications
- Shortlisted candidates
- Hired count
- Active jobs
- Application pipeline status
- Hiring insights chart
- Time-to-hire metrics
- Source effectiveness

**Widgets:**
- Stats cards with key metrics
- Active roles panel
- Hiring insights pie chart
- Recent applications list
- Integration status

**Updates:**
- Real-time data refresh
- Auto-updates on status changes
- Live candidate pipeline
- Instant notifications

### 6. Candidate Pipeline Management

**Stages:**
1. Applied
2. Screening
3. Interview Scheduled
4. Offer
5. Hired
6. Rejected

**Features:**
- Drag-and-drop between stages
- Bulk actions
- Status filtering
- Quick candidate preview
- Notes and comments
- Timeline view
- Email notifications on status change

**How to use:**
1. Go to Applications page
2. Filter by status or job
3. Update status via dropdown
4. Add notes for each stage
5. Track progress through pipeline

### 7. Analytics & Reporting

**Metrics Tracked:**
- Total applications
- Applications by status
- Applications by job
- Time-to-hire average
- Conversion rates
- Source attribution
- Diversity metrics (aggregate)

**Reports:**
- Daily/weekly/monthly summaries
- Job performance reports
- Recruiter performance
- Source effectiveness
- Funnel analysis
- Export to PDF/Excel

**Visualizations:**
- Pie charts for status distribution
- Bar charts for applications by job
- Line charts for trends
- Funnel visualization

### 8. Email Automation

**Automated Emails:**
- Application confirmation
- Screening invitation
- Interview invitation with calendar
- Interview reminders (24hrs, 1hr)
- Status update notifications
- Offer letters
- Rejection notifications

**Email Features:**
- HTML templates
- Calendar event attachments (.ics)
- Personalization
- Bulk sending
- Delivery tracking
- Gmail SMTP integration

### 9. Audit Trail & Compliance

**What's Logged:**
- All candidate access
- Status changes
- Profile views
- Document downloads
- User actions
- Timestamps

**Compliance Features:**
- GDPR-ready data handling
- Right to be forgotten
- Data export
- Access logs
- Bias removal tracking
- Equal opportunity compliance

### 10. Multi-User Support

**Roles:**
- Admin: Full system access
- Recruiter: Manage candidates and jobs
- Interviewer: View candidates, conduct interviews
- Hiring Manager: Review and approve

**Permissions:**
- Role-based access control
- Job-specific permissions
- Candidate visibility rules
- Action restrictions

## Technical Features

### Security
- JWT-based authentication
- Password hashing (bcrypt)
- SQL injection prevention
- XSS protection
- CSRF protection
- Rate limiting
- Secure file uploads

### Performance
- Database indexing
- Query optimization
- Lazy loading
- Caching
- CDN-ready
- Optimized images
- Code splitting

### Scalability
- Horizontal scaling ready
- Database connection pooling
- Stateless architecture
- Docker containerization
- Load balancer compatible
- Microservices-ready

### Integrations
- Google Calendar API
- Gmail SMTP
- Slack notifications (coming soon)
- Zoom API (coming soon)
- LinkedIn integration (coming soon)
- ATS systems (coming soon)

## Free Tier Limitations

All features work on free tiers:
- Groq API: 14,400 requests/day
- Gmail SMTP: 500 emails/day
- Google Calendar: 1M requests/day
- PostgreSQL: Unlimited (self-hosted)

## Roadmap

Coming soon:
- Video interview recording
- AI interview analysis
- Candidate matching algorithm
- Mobile app
- Advanced analytics
- Custom workflows
- API webhooks
- SSO integration
