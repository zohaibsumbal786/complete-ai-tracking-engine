import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', async (req, res) => {
  try {
    // Total applications
    const totalApps = await pool.query('SELECT COUNT(*) as count FROM applications');
    
    // Applications by status
    const byStatus = await pool.query(`
      SELECT status, COUNT(*) as count 
      FROM applications 
      GROUP BY status
    `);
    
    // Active jobs
    const activeJobs = await pool.query(`
      SELECT COUNT(*) as count 
      FROM jobs 
      WHERE status = 'active'
    `);
    
    // Recent applications
    const recentApps = await pool.query(`
      SELECT a.*, c.name as candidate_name, j.title as job_title
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      ORDER BY a.applied_at DESC
      LIMIT 10
    `);
    
    // Time to hire (average days from application to offer)
    const timeToHire = await pool.query(`
      SELECT AVG(EXTRACT(DAY FROM (
        SELECT MAX(created_at) 
        FROM audit_logs 
        WHERE details->>'applicationId' = a.id::text 
        AND action = 'application_status_changed'
      ) - a.applied_at)) as avg_days
      FROM applications a
      WHERE a.status = 'offer'
    `);
    
    // Applications by job
    const appsByJob = await pool.query(`
      SELECT j.title, COUNT(a.id) as count
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      GROUP BY j.id, j.title
      ORDER BY count DESC
      LIMIT 5
    `);
    
    res.json({
      totalApplications: parseInt(totalApps.rows[0].count),
      applicationsByStatus: byStatus.rows,
      activeJobs: parseInt(activeJobs.rows[0].count),
      recentApplications: recentApps.rows,
      averageTimeToHire: parseFloat(timeToHire.rows[0].avg_days) || 0,
      applicationsByJob: appsByJob.rows
    });
  } catch (error) {
    console.error('Analytics error:', error);
    res.status(500).json({ error: 'Failed to fetch analytics' });
  }
});

router.get('/reports', async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    let dateFilter = '';
    const params: any[] = [];
    
    if (startDate && endDate) {
      params.push(startDate, endDate);
      dateFilter = ` WHERE applied_at BETWEEN $1 AND $2`;
    }
    
    const report = await pool.query(`
      SELECT 
        DATE(applied_at) as date,
        COUNT(*) as applications,
        COUNT(CASE WHEN status = 'hired' THEN 1 END) as hired
      FROM applications
      ${dateFilter}
      GROUP BY DATE(applied_at)
      ORDER BY date DESC
    `, params);
    
    res.json(report.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to generate report' });
  }
});

export default router;
