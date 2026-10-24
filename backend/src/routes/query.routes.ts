import { Router } from 'express';
import { RAGService } from '../services/rag.service';
import { z } from 'zod';

const router = Router();

const querySchema = z.object({
  question: z.string().min(1),
  userId: z.string().optional(),
});

// POST /api/query - Ask a question
router.post('/', async (req, res) => {
  try {
    const { question, userId } = querySchema.parse(req.body);
    const result = await RAGService.query(question, userId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// GET /api/query/low-confidence - Get low confidence queries
router.get('/low-confidence', async (req, res) => {
  try {
    const threshold = req.query.threshold ? parseFloat(req.query.threshold as string) : 70;
    const queries = await RAGService.getLowConfidenceQueries(threshold);
    res.json(queries);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
