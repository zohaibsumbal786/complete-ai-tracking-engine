import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import cvParserService from '../services/cv-parser.service';

const router = Router();

router.use(authenticate);

router.post('/upload-cv', upload.single('cv'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    
    const { jobId } = req.body;
    
    // Parse CV
    const parseResult = await cvParserService.parseFile(req.file.path);
    
    // Create candidate
    const candidateResult = await pool.query(
      `INSERT INTO candidates (name, email, phone, cv_file_path, parsed_data, bias_free_profile) 
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [
        parseResult.parsedData.name || 'Unknown',
        parseResult.parsedData.email || null,
        parseResult.parsedData.phone || null,
        req.file.path,
        JSON.stringify(parseResult.parsedData),
        JSON.stringify(parseResult.biasFreeProfile)
      ]
    );
    
    const candidate = candidateResult.rows[0];
    
    // Create application if jobId provided
    if (jobId) {
      await pool.query(
        'INSERT INTO applications (candidate_id, job_id) VALUES ($1, $2)',
        [candidate.id, jobId]
      );
    }
    
    // Log action
    await pool.query(
      'INSERT INTO audit_logs (action, user_id, candidate_id, details) VALUES ($1, $2, $3, $4)',
      ['cv_uploaded', (req as any).user.id, candidate.id, JSON.stringify({ jobId })]
    );
    
    res.status(201).json(candidate);
  } catch (error: any) {
    console.error('CV upload error:', error);
    res.status(500).json({ error: error.message || 'Failed to upload CV' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, search } = req.query;
    
    let query = 'SELECT * FROM candidates WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      query += ` AND status = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND (name ILIKE $${params.length} OR email ILIKE $${params.length})`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidates' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM candidates WHERE id = $1', [req.params.id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch candidate' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, email, phone, status } = req.body;
    
    const result = await pool.query(
      'UPDATE candidates SET name = $1, email = $2, phone = $3, status = $4 WHERE id = $5 RETURNING *',
      [name, email, phone, status, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Candidate not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update candidate' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM candidates WHERE id = $1', [req.params.id]);
    res.json({ message: 'Candidate deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete candidate' });
  }
});

export default router;
