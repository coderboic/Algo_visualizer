import { Request, Response, NextFunction } from 'express';
import { algorithmService } from '../services/algorithm.service';
import { AppError } from '../middleware/errorHandler';

class AlgorithmController {
  async getAllAlgorithms(_req: Request, res: Response, next: NextFunction) {
    try {
      const algorithms = await algorithmService.getAllAlgorithms();
      res.json({
        status: 'success',
        data: algorithms
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlgorithmById(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const algorithm = await algorithmService.getAlgorithmById(id);
      
      if (!algorithm) {
        throw new AppError('Algorithm not found', 404);
      }

      res.json({
        status: 'success',
        data: algorithm
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlgorithmsByCategory(req: Request, res: Response, next: NextFunction) {
    try {
      const { category } = req.params;
      const algorithms = await algorithmService.getAlgorithmsByCategory(category);
      
      res.json({
        status: 'success',
        data: algorithms
      });
    } catch (error) {
      next(error);
    }
  }

  async getAlgorithmExample(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const example = await algorithmService.getAlgorithmExample(id);
      
      if (!example) {
        throw new AppError('Example not found', 404);
      }

      res.json({
        status: 'success',
        data: example
      });
    } catch (error) {
      next(error);
    }
  }
}

export const algorithmController = new AlgorithmController();