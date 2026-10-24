import { Router } from 'express';
import { ClusteringService } from '../services/clustering.service';
import { pool } from '../config/database';

const router = Router();

// POST /api/analytics/cluster - Trigger clustering for a specific week
router.post('/cluster', async (req, res) => {
  try {
    const weekStart = req.body.weekStart ? new Date(req.body.weekStart) : new Date();
    const clusters = await ClusteringService.performWeeklyClustering(weekStart);
    res.json({ clusters, count: clusters.length });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/clusters - Get clusters for a week
router.get('/clusters', async (req, res) => {
  try {
    const weekStart = req.query.weekStart ? new Date(req.query.weekStart as string) : new Date();
    const clusters = await ClusteringService.getClustersForWeek(weekStart);
    res.json(clusters);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/analytics/stats - Get overall statistics
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT 
        COUNT(*) as total_queries,
        AVG(confidence_score) as avg_confidence,
        COUNT(CASE WHEN confidence_score < 70 THEN 1 END) as low_confidence_count
      FROM queries
    `);

    const weeklyStats = await pool.query(`
      SELECT 
        DATE_TRUNC('week', timestamp) as week,
        COUNT(*) as query_count,
        AVG(confidence_score) as avg_confidence
      FROM queries
      WHERE timestamp >= NOW() - INTERVAL '8 weeks'
      GROUP BY week
      ORDER BY week DESC
    `);

    res.json({
      overall: stats.rows[0],
      weekly: weeklyStats.rows,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
