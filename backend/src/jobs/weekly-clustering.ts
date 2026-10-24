#!/usr/bin/env tsx
/**
 * Manual script to run weekly clustering
 * Usage: npm run cluster:weekly
 */

import dotenv from 'dotenv';
import { ClusteringService } from '../services/clustering.service';
import { logger } from '../utils/logger';

dotenv.config();

async function main() {
  try {
    const today = new Date();
    const weekStart = new Date(today.setDate(today.getDate() - today.getDay()));
    
    logger.info(`Running clustering for week starting ${weekStart.toISOString()}`);
    
    const clusters = await ClusteringService.performWeeklyClustering(weekStart);
    logger.info(`Created ${clusters.length} clusters`);
    
    await ClusteringService.identifySOPUpdates(weekStart);
    logger.info('SOP updates identified');
    
    process.exit(0);
  } catch (error) {
    logger.error('Clustering failed:', error);
    process.exit(1);
  }
}

main();
