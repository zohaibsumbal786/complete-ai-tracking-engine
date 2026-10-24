import { Express } from 'express';
import queryRoutes from './query.routes';
import documentRoutes from './document.routes';
import analyticsRoutes from './analytics.routes';
import sopRoutes from './sop.routes';

export function setupRoutes(app: Express) {
  app.use('/api/query', queryRoutes);
  app.use('/api/documents', documentRoutes);
  app.use('/api/analytics', analyticsRoutes);
  app.use('/api/sop', sopRoutes);
}
