import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import jobRoutes from './routes/job.routes';
import candidateRoutes from './routes/candidate.routes';
import applicationRoutes from './routes/application.routes';
import screeningRoutes from './routes/screening.routes';
import interviewRoutes from './routes/interview.routes';
import analyticsRoutes from './routes/analytics.routes';
import integrationRoutes from './routes/integration.routes';
import { errorHandler } from './middleware/error.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:5173', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/candidates', candidateRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/screening', screeningRoutes);
app.use('/api/interviews', interviewRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/integrations', integrationRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV}`);
});
