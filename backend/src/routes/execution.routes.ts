import { Router } from 'express';
import { executionController } from '../controllers/execution.controller';

const router = Router();

// Execute custom code
router.post('/', executionController.executeCode);

// Validate code syntax
router.post('/validate', executionController.validateCode);

// Get execution status
router.get('/status/:id', executionController.getExecutionStatus);

export default router;