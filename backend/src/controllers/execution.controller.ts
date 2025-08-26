import { Request, Response, NextFunction } from 'express';
import { executionService } from '../services/execution.service';
import { AppError } from '../middleware/errorHandler';

class ExecutionController {
  async executeCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language, input } = req.body;

      if (!code) {
        throw new AppError('Code is required', 400);
      }

      const result = await executionService.executeCode({
        code,
        language: language || 'javascript',
        input
      });

      res.json({
        status: 'success',
        data: result
      });
    } catch (error) {
      next(error);
    }
  }

  async validateCode(req: Request, res: Response, next: NextFunction) {
    try {
      const { code, language } = req.body;

      if (!code) {
        throw new AppError('Code is required', 400);
      }

      const validation = await executionService.validateCode({
        code,
        language: language || 'javascript'
      });

      res.json({
        status: 'success',
        data: validation
      });
    } catch (error) {
      next(error);
    }
  }

  async getExecutionStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const status = await executionService.getExecutionStatus(id);

      if (!status) {
        throw new AppError('Execution not found', 404);
      }

      res.json({
        status: 'success',
        data: status
      });
    } catch (error) {
      next(error);
    }
  }
}

export const executionController = new ExecutionController();