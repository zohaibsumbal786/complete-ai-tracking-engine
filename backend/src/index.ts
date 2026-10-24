import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { setupRoutes } from './routes';
import { initializeDatabase } from './config/database';
import { initializeQdrant } from './config/qdrant';
import { startScheduledJobs } from './jobs';
import { logger } from './utils/logger';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Setup routes
setupRoutes(app);

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  logger.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Initialize and start server
async function start() {
  try {
    // Initialize database
    await initializeDatabase();
    logger.info('Database initialized');

    // Initialize Qdrant
    await initializeQdrant();
    logger.info('Qdrant initialized');

    // Start scheduled jobs
    startScheduledJobs();
    logger.info('Scheduled jobs started');

    // Start server
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📊 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
}

start();
