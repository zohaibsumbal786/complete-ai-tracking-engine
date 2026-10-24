import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT j.*, 
             COUNT(DISTINCT a.id) as applicant_count,
             u.name as created_by_name
      FROM jobs j
      LEFT JOIN applications a ON j.id = a.job_id
      LEFT JOIN users u ON j.created_by = u.id
      GROUP BY j.id, u.name
      ORDER BY j.created_at DESC
    `);
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch jobs' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM jobs WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch job' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, salary_min, salary_max, requirements } = req.body;
    const userId = (req as any).user.id;
    
    const result = await pool.query(
      `INSERT INTO jobs (title, description, salary_min, salary_max, requirements, created_by) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [title, description, salary_min, salary_max, JSON.stringify(requirements), userId]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create job' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { title, description, salary_min, salary_max, requirements, status } = req.body;
    
    const result = await pool.query(
      `UPDATE jobs 
       SET title = $1, description = $2, salary_min = $3, salary_max = $4, 
           requirements = $5, status = $6
       WHERE id = $7 RETURNING *`,
      [title, description, salary_min, salary_max, JSON.stringify(requirements), status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update job' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM jobs WHERE id = $1', [req.params.id]);
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete job' });
  }
});

export default router;
