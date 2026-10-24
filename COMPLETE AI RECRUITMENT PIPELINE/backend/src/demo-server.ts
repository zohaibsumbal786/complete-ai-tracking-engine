import express from 'express';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { mockDb, getMockAnalytics } from './database/mock-db';

const app = express();
const PORT = 3000;
const JWT_SECRET = 'dev-secret-key-for-testing-min-32-characters-long-12345';

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  if (email === 'admin@recruitment.ai' && password === 'admin123') {
    const user = { id: 1, email, name: 'Admin User', role: 'admin' };
    const token = jwt.sign(user, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ user, token });
  }
  
  res.status(401).json({ error: 'Invalid credentials' });
});

// Jobs endpoints
app.get('/api/jobs', (req, res) => {
  res.json(mockDb.jobs);
});

app.post('/api/jobs', (req, res) => {
  const newJob = {
    id: mockDb.jobs.length + 1,
    ...req.body,
    status: 'active',
    created_at: new Date(),
    created_by: 1,
    applicant_count: 0
  };
  mockDb.jobs.push(newJob);
  res.status(201).json(newJob);
});

// Candidates endpoints
app.get('/api/candidates', (req, res) => {
  res.json(mockDb.candidates);
});

app.post('/api/candidates/upload-cv', (req, res) => {
  const mockCandidate = {
    id: mockDb.candidates.length + 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    cv_file_path: '/uploads/mock-cv.pdf',
    parsed_data: {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      summary: 'Experienced software developer',
      experience: [
        {
          company: 'Tech Corp',
          role: 'Senior Developer',
          duration: '2020-2024',
          responsibilities: ['Led team of 5', 'Built scalable systems']
        }
      ],
      education: [
        { degree: 'BS Computer Science', institution: 'University', year: '2020' }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL'],
      certifications: ['AWS Certified'],
      languages: ['English', 'Spanish']
    },
    bias_free_profile: {
      summary: 'Experienced software developer',
      experience: [
        {
          role: 'Senior Developer',
          duration: '2020-2024',
          responsibilities: ['Led team of 5', 'Built scalable systems']
        }
      ],
      skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL']
    },
    status: 'new',
    created_at: new Date()
  };
  mockDb.candidates.push(mockCandidate);
  res.status(201).json(mockCandidate);
});

// Applications endpoints
app.get('/api/applications', (req, res) => {
  res.json(mockDb.applications);
});

app.post('/api/applications', (req, res) => {
  const newApp = {
    id: mockDb.applications.length + 1,
    ...req.body,
    status: 'applied',
    applied_at: new Date(),
    screening_score: 0
  };
  mockDb.applications.push(newApp);
  res.status(201).json(newApp);
});

app.put('/api/applications/:id/status', (req, res) => {
  const app = mockDb.applications.find(a => a.id === parseInt(req.params.id));
  if (app) {
    app.status = req.body.status;
    res.json(app);
  } else {
    res.status(404).json({ error: 'Application not found' });
  }
});

// Screening endpoints
app.post('/api/screening/generate-questions', (req, res) => {
  const questions = [
    {
      id: 1,
      job_id: req.body.jobId,
      question_text: 'What is your experience with React?',
      question_type: 'multiple_choice',
      options: ['0-1 years', '1-3 years', '3-5 years', '5+ years'],
      correct_answer: '3-5 years',
      points: 10
    },
    {
      id: 2,
      job_id: req.body.jobId,
      question_text: 'Describe your approach to problem-solving',
      question_type: 'short_answer',
      options: null,
      correct_answer: null,
      points: 15
    }
  ];
  res.status(201).json(questions);
});

app.get('/api/screening/questions/:jobId', (req, res) => {
  res.json([]);
});

// Interviews endpoints
app.get('/api/interviews', (req, res) => {
  res.json(mockDb.interviews);
});

app.post('/api/interviews/schedule', (req, res) => {
  const newInterview = {
    id: mockDb.interviews.length + 1,
    ...req.body,
    status: 'scheduled',
    created_at: new Date()
  };
  mockDb.interviews.push(newInterview);
  res.status(201).json(newInterview);
});

// Analytics endpoints
app.get('/api/analytics/dashboard', (req, res) => {
  res.json(getMockAnalytics());
});

app.get('/api/analytics/reports', (req, res) => {
  res.json([]);
});

// Integration endpoints
app.post('/api/integrations/google-calendar/auth', (req, res) => {
  res.json({ message: 'Google Calendar integration coming soon' });
});

app.listen(PORT, () => {
  console.log('🚀 Demo Server running on port', PORT);
  console.log('📊 Environment: DEMO MODE (No database required)');
  console.log('✅ Ready to accept requests');
  console.log('');
  console.log('Login credentials:');
  console.log('  Email: admin@recruitment.ai');
  console.log('  Password: admin123');
  console.log('');
  console.log('Frontend should be at: http://localhost:5173');
});
