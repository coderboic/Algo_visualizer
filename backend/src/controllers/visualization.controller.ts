import { Request, Response, NextFunction } from 'express';
import { visualizationService } from '../services/visualization.service';
import { AppError } from '../middleware/errorHandler';

class VisualizationController {
  async generateVisualization(req: Request, res: Response, next: NextFunction) {
    try {
      const { algorithm, input, options } = req.body;

      if (!algorithm || !input) {
        throw new AppError('Algorithm and input are required', 400);
      }

      const visualization = await visualizationService.generateVisualization({
        algorithm,
        input,
        options
      });

      res.json({
        status: 'success',
        data: visualization
      });
    } catch (error) {
      next(error);
    }
  }

  async getVisualization(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const visualization = await visualizationService.getVisualization(id);

      if (!visualization) {
        throw new AppError('Visualization not found', 404);
      }

      res.json({
        status: 'success',
        data: visualization
      });
    } catch (error) {
      next(error);
    }
  }

  async saveVisualization(req: Request, res: Response, next: NextFunction) {
    try {
      const { algorithmId, inputData, steps, userId, isPublic } = req.body;

      if (!algorithmId || !inputData || !steps) {
        throw new AppError('Algorithm ID, input data, and steps are required', 400);
      }

      const saved = await visualizationService.saveVisualization({
        algorithmId,
        inputData,
        steps,
        userId,
        isPublic
      });

      res.json({
        status: 'success',
        data: saved
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllVisualizations(req: Request, res: Response, next: NextFunction) {
    try {
      const { limit = 10, offset = 0, isPublic = true } = req.query;
      
      const visualizations = await visualizationService.getAllVisualizations({
        limit: Number(limit),
        offset: Number(offset),
        isPublic: isPublic === 'true'
      });

      res.json({
        status: 'success',
        data: visualizations
      });
    } catch (error) {
      next(error);
    }
  }
}

export const visualizationController = new VisualizationController();