import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const { jobId, status } = req.query;
    
    let query = `
      SELECT a.*, 
             c.name as candidate_name, 
             c.email as candidate_email,
             c.bias_free_profile,
             j.title as job_title
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (jobId) {
      params.push(jobId);
      query += ` AND a.job_id = $${params.length}`;
    }
    
    if (status) {
      params.push(status);
      query += ` AND a.status = $${params.length}`;
    }
    
    query += ' ORDER BY a.applied_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { candidateId, jobId } = req.body;
    
    const result = await pool.query(
      'INSERT INTO applications (candidate_id, job_id) VALUES ($1, $2) RETURNING *',
      [candidateId, jobId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error.code === '23505') {
      return res.status(400).json({ error: 'Application already exists' });
    }
    res.status(500).json({ error: 'Failed to create application' });
  }
});

router.put('/:id/status', async (req, res) => {
  try {
    const { status, notes } = req.body;
    
    const result = await pool.query(
      'UPDATE applications SET status = $1, notes = $2 WHERE id = $3 RETURNING *',
      [status, notes, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    // Log status change
    await pool.query(
      'INSERT INTO audit_logs (action, user_id, details) VALUES ($1, $2, $3)',
      ['application_status_changed', (req as any).user.id, JSON.stringify({ applicationId: req.params.id, status })]
    );
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

export default router;
