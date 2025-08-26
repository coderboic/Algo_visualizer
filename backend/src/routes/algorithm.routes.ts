import { Router } from 'express';
import { algorithmController } from '../controllers/algorithm.controller';

const router = Router();

// Get all algorithms
router.get('/', algorithmController.getAllAlgorithms);

// Get algorithm by ID
router.get('/:id', algorithmController.getAlgorithmById);

// Get algorithm by category
router.get('/category/:category', algorithmController.getAlgorithmsByCategory);

// Get algorithm example code
router.get('/:id/example', algorithmController.getAlgorithmExample);

export default router;