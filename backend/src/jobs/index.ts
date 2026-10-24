import cron from 'node-cron';
import { ClusteringService } from '../services/clustering.service';
import { logger } from '../utils/logger';

export function startScheduledJobs() {
  // Run weekly clustering every Monday at 1 AM
  cron.schedule('0 1 * * 1', async () => {
    try {
      logger.info('Starting weekly clustering job');
      
      const today = new Date();
      const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
      
      await ClusteringService.performWeeklyClustering(weekStart);
      await ClusteringService.identifySOPUpdates(weekStart);
      
      logger.info('Weekly clustering job completed');
    } catch (error) {
      logger.error('Weekly clustering job failed:', error);
    }
  });

  logger.info('Scheduled jobs initialized');
}
