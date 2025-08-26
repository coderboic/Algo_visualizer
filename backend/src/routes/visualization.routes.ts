import { Router } from 'express';
import { visualizationController } from '../controllers/visualization.controller';

const router = Router();

// Generate visualization data
router.post('/', visualizationController.generateVisualization);

// Get saved visualization
router.get('/:id', visualizationController.getVisualization);

// Save visualization
router.post('/save', visualizationController.saveVisualization);

// Get all visualizations
router.get('/', visualizationController.getAllVisualizations);

export default router;