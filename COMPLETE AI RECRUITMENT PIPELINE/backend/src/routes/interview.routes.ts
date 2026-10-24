import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';
import emailService from '../services/email.service';

const router = Router();

router.use(authenticate);

router.post('/schedule', async (req, res) => {
  try {
    const { applicationId, scheduledAt, meetingLink, interviewerId } = req.body;
    const userId = (req as any).user.id;
    
    // Get application and candidate details
    const appResult = await pool.query(`
      SELECT a.*, c.name as candidate_name, c.email as candidate_email, j.title as job_title
      FROM applications a
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      WHERE a.id = $1
    `, [applicationId]);
    
    if (appResult.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    const application = appResult.rows[0];
    
    // Create interview
    const result = await pool.query(
      `INSERT INTO interviews (application_id, scheduled_at, meeting_link, interviewer_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [applicationId, scheduledAt, meetingLink, interviewerId || userId]
    );
    
    const interview = result.rows[0];
    
    // Update application status
    await pool.query(
      'UPDATE applications SET status = $1 WHERE id = $2',
      ['interview_scheduled', applicationId]
    );
    
    // Send email invitation
    try {
      await emailService.sendInterviewInvite(
        application.candidate_email,
        application.candidate_name,
        new Date(scheduledAt),
        meetingLink,
        application.job_title
      );
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
    }
    
    res.status(201).json(interview);
  } catch (error) {
    console.error('Interview scheduling error:', error);
    res.status(500).json({ error: 'Failed to schedule interview' });
  }
});

router.get('/', async (req, res) => {
  try {
    const { status, upcoming } = req.query;
    
    let query = `
      SELECT i.*, 
             a.candidate_id,
             c.name as candidate_name,
             c.email as candidate_email,
             j.title as job_title,
             u.name as interviewer_name
      FROM interviews i
      JOIN applications a ON i.application_id = a.id
      JOIN candidates c ON a.candidate_id = c.id
      JOIN jobs j ON a.job_id = j.id
      LEFT JOIN users u ON i.interviewer_id = u.id
      WHERE 1=1
    `;
    const params: any[] = [];
    
    if (status) {
      params.push(status);
      query += ` AND i.status = $${params.length}`;
    }
    
    if (upcoming === 'true') {
      query += ` AND i.scheduled_at > NOW()`;
    }
    
    query += ' ORDER BY i.scheduled_at ASC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch interviews' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { scheduledAt, meetingLink, status, notes } = req.body;
    
    const result = await pool.query(
      `UPDATE interviews 
       SET scheduled_at = COALESCE($1, scheduled_at),
           meeting_link = COALESCE($2, meeting_link),
           status = COALESCE($3, status),
           notes = COALESCE($4, notes)
       WHERE id = $5 RETURNING *`,
      [scheduledAt, meetingLink, status, notes, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Interview not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update interview' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await pool.query('DELETE FROM interviews WHERE id = $1', [req.params.id]);
    res.json({ message: 'Interview deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete interview' });
  }
});

export default router;
