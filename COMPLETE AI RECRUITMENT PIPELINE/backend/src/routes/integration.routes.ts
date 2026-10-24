import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

// Placeholder for Google Calendar integration
router.post('/google-calendar/auth', async (req, res) => {
  res.json({ message: 'Google Calendar integration coming soon' });
});

router.post('/gmail/send', async (req, res) => {
  res.json({ message: 'Gmail integration available via email service' });
});

export default router;
