import { Router } from 'express';
import pool from '../database/db';
import { authenticate } from '../middleware/auth.middleware';
import aiService from '../services/ai.service';

const router = Router();

router.use(authenticate);

router.post('/generate-questions', async (req, res) => {
  try {
    const { jobId } = req.body;
    
    // Get job details
    const jobResult = await pool.query('SELECT * FROM jobs WHERE id = $1', [jobId]);
    
    if (jobResult.rows.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }
    
    const job = jobResult.rows[0];
    
    // Generate questions using AI
    const questions = await aiService.generateScreeningQuestions(job.title, job.requirements);
    
    // Save questions to database
    const savedQuestions = [];
    for (const q of questions) {
      const result = await pool.query(
        `INSERT INTO screening_questions (job_id, question_text, question_type, options, correct_answer, points) 
         VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
        [jobId, q.question, q.type, JSON.stringify(q.options), q.correctAnswer, q.points]
      );
      savedQuestions.push(result.rows[0]);
    }
    
    res.status(201).json(savedQuestions);
  } catch (error: any) {
    console.error('Question generation error:', error);
    res.status(500).json({ error: error.message || 'Failed to generate questions' });
  }
});

router.get('/questions/:jobId', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM screening_questions WHERE job_id = $1 ORDER BY created_at',
      [req.params.jobId]
    );
    
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch questions' });
  }
});

router.post('/submit-answers', async (req, res) => {
  try {
    const { applicationId, answers } = req.body;
    
    let totalScore = 0;
    
    for (const answer of answers) {
      // Get question
      const questionResult = await pool.query(
        'SELECT * FROM screening_questions WHERE id = $1',
        [answer.questionId]
      );
      
      if (questionResult.rows.length === 0) continue;
      
      const question = questionResult.rows[0];
      
      // Calculate score
      let score = 0;
      if (question.correct_answer && answer.answer === question.correct_answer) {
        score = question.points;
      }
      
      totalScore += score;
      
      // Save answer
      await pool.query(
        'INSERT INTO candidate_answers (application_id, question_id, answer_text, score) VALUES ($1, $2, $3, $4)',
        [applicationId, answer.questionId, answer.answer, score]
      );
    }
    
    // Update application score
    await pool.query(
      'UPDATE applications SET screening_score = $1, status = $2 WHERE id = $3',
      [totalScore, 'screening_completed', applicationId]
    );
    
    res.json({ totalScore, message: 'Answers submitted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to submit answers' });
  }
});

export default router;
