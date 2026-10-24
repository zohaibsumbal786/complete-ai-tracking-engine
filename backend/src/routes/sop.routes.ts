import { Router } from 'express';
import { pool } from '../config/database';
import { z } from 'zod';

const router = Router();

const updateSOPSchema = z.object({
  status: z.enum(['to_update', 'in_progress', 'in_review', 'done']).optional(),
  assignee: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
});

// GET /api/sop - Get all SOP updates
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, c.summary as cluster_summary, c.question_ids
      FROM sop_updates s
      LEFT JOIN question_clusters c ON s.cluster_id = c.id
      ORDER BY 
        CASE s.priority 
          WHEN 'high' THEN 1 
          WHEN 'medium' THEN 2 
          ELSE 3 
        END,
        s.created_at DESC
    `);

    res.json(result.rows);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/sop/:id - Update SOP status/assignee
router.patch('/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updates = updateSOPSchema.parse(req.body);

    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (updates.status) {
      setClauses.push(`status = $${paramIndex++}`);
      values.push(updates.status);
    }

    if (updates.assignee) {
      setClauses.push(`assignee = $${paramIndex++}`);
      values.push(updates.assignee);
    }

    if (updates.priority) {
      setClauses.push(`priority = $${paramIndex++}`);
      values.push(updates.priority);
    }

    setClauses.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE sop_updates 
      SET ${setClauses.join(', ')}
      WHERE id = $${paramIndex}
      RETURNING *
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'SOP update not found' });
    }

    res.json(result.rows[0]);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/sop/by-status - Get SOPs grouped by status
router.get('/by-status', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT s.*, c.summary as cluster_summary
      FROM sop_updates s
      LEFT JOIN question_clusters c ON s.cluster_id = c.id
      ORDER BY s.status, s.priority
    `);

    const grouped = {
      to_update: [] as any[],
      in_progress: [] as any[],
      in_review: [] as any[],
      done: [] as any[],
    };

    result.rows.forEach(row => {
      grouped[row.status as keyof typeof grouped].push(row);
    });

    res.json(grouped);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
