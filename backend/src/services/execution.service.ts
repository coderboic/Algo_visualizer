import { v4 as uuidv4 } from 'uuid';

interface ExecutionRequest {
  code: string;
  language: string;
  input?: any;
}

interface ExecutionResult {
  id: string;
  output: any;
  steps: any[];
  error?: string;
  executionTime: number;
  memoryUsed: number;
}

class ExecutionService {
  private executions: Map<string, ExecutionResult> = new Map();

  async executeCode(request: ExecutionRequest): Promise<ExecutionResult> {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      // For now, we'll implement a simple JavaScript executor
      // In production, this should use a sandboxed environment
      const result = await this.executeJavaScript(request.code, request.input);
      
      const executionResult: ExecutionResult = {
        id: executionId,
        output: result.output,
        steps: result.steps,
        executionTime: Date.now() - startTime,
        memoryUsed: process.memoryUsage().heapUsed
      };

      this.executions.set(executionId, executionResult);
      return executionResult;
    } catch (error: any) {
      const executionResult: ExecutionResult = {
        id: executionId,
        output: null,
        steps: [],
        error: error.message,
        executionTime: Date.now() - startTime,
        memoryUsed: process.memoryUsage().heapUsed
      };

      this.executions.set(executionId, executionResult);
      return executionResult;
    }
  }

  async validateCode(request: { code: string; language: string }): Promise<any> {
    try {
      // Basic syntax validation
      if (request.language === 'javascript') {
        new Function(request.code);
      }
      
      return {
        valid: true,
        errors: []
      };
    } catch (error: any) {
      return {
        valid: false,
        errors: [{
          message: error.message,
          line: this.extractLineNumber(error.message)
        }]
      };
    }
  }

  async getExecutionStatus(id: string): Promise<ExecutionResult | null> {
    return this.executions.get(id) || null;
  }

  private async executeJavaScript(code: string, input: any): Promise<any> {
    const steps: any[] = [];
    const output: any[] = [];

    // Create a sandboxed context with visualization functions
    const visualizationAPI = {
      visualize: (state: any) => {
        steps.push({ type: 'state', data: state, timestamp: Date.now() });
      },
      highlight: (indices: number[]) => {
        steps.push({ type: 'highlight', indices, timestamp: Date.now() });
      },
      swap: (i: number, j: number) => {
        steps.push({ type: 'swap', indices: [i, j], timestamp: Date.now() });
      },
      compare: (i: number, j: number) => {
        steps.push({ type: 'compare', indices: [i, j], timestamp: Date.now() });
      },
      mark: (index: number, type: string) => {
        steps.push({ type: 'mark', index, markType: type, timestamp: Date.now() });
      },
      log: (message: any) => {
        output.push(message);
        steps.push({ type: 'log', message, timestamp: Date.now() });
      }
    };

    // Create a function with the visualization API
    const wrappedCode = `
      const { visualize, highlight, swap, compare, mark, log } = api;
      const input = inputData;
      ${code}
    `;

    try {
      const func = new Function('api', 'inputData', wrappedCode);
      func(visualizationAPI, input);
      
      return { output, steps };
    } catch (error) {
      throw error;
    }
  }

  private extractLineNumber(errorMessage: string): number | null {
    const match = errorMessage.match(/:(\d+):/);
    return match ? parseInt(match[1], 10) : null;
  }
}

export const executionService = new ExecutionService();