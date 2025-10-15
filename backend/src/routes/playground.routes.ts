import { Router, Request, Response } from 'express';
import { playgroundService } from '../services/playground.service';

const router = Router();

// Execute code
router.post('/execute', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language, input } = req.body;

    if (!code || !language) {
      res.status(400).json({ error: 'Code and language are required' });
      return;
    }

    const result = await playgroundService.executeCode({
      code,
      language,
      input,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Fix code with AI
router.post('/fix', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language, error } = req.body;

    if (!code || !language) {
      res.status(400).json({ error: 'Code and language are required' });
      return;
    }

    const result = await playgroundService.fixCodeWithAI({
      code,
      language,
      error,
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Analyze code
router.post('/analyze', async (req: Request, res: Response): Promise<void> => {
  try {
    const { code, language } = req.body;

    if (!code || !language) {
      res.status(400).json({ error: 'Code and language are required' });
      return;
    }

    const result = await playgroundService.analyzeCode(code, language);

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Get supported languages
router.get('/languages', async (_req: Request, res: Response): Promise<void> => {
  try {
    const languages = playgroundService.getSupportedLanguages();
    res.json({ languages });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
