import { v4 as uuidv4 } from 'uuid';
import { algorithmExecutors } from '../data/algorithms.comprehensive';

interface ExecutionRequest {
  algorithmId: string;
  input: any;
  options?: {
    stepDelay?: number;
    maxSteps?: number;
  };
}

interface ExecutionResult {
  id: string;
  algorithmId: string;
  steps: any[];
  output: any;
  error?: string;
  executionTime: number;
  totalSteps: number;
}

export class ComprehensiveExecutionService {
  private executions: Map<string, ExecutionResult> = new Map();

  async executeAlgorithm(request: ExecutionRequest): Promise<ExecutionResult> {
    const executionId = uuidv4();
    const startTime = Date.now();

    try {
      const executor: any = algorithmExecutors[request.algorithmId as keyof typeof algorithmExecutors];
      
      if (!executor) {
        throw new Error(`Algorithm ${request.algorithmId} not found`);
      }

      let steps: any[] = [];
      let output: any = null;

      // Execute based on algorithm category
      const category = this.getAlgorithmCategory(request.algorithmId);

      switch (category) {
        case 'sorting':
          steps = executor(request.input.array || request.input);
          output = steps[steps.length - 1]?.array;
          break;

        case 'searching':
          steps = executor(request.input.array || request.input, request.input.target);
          output = steps[steps.length - 1];
          break;

        case 'graph':
          const { nodes, edges, startNode } = request.input;
          if (request.algorithmId === 'kruskal') {
            steps = executor(nodes, edges);
          } else if (request.algorithmId === 'floyd-warshall') {
            steps = executor(nodes, edges);
          } else {
            steps = executor(nodes, edges, startNode);
          }
          output = steps[steps.length - 1];
          break;

        case 'dynamic-programming':
          steps = this.executeDPAlgorithm(request.algorithmId, request.input, executor);
          output = steps[steps.length - 1]?.result;
          break;

        case 'string':
          const { text, pattern } = request.input;
          steps = executor(text, pattern);
          output = steps[steps.length - 1];
          break;

        default:
          throw new Error(`Unknown algorithm category for ${request.algorithmId}`);
      }

      // Apply step limit if specified
      if (request.options?.maxSteps && steps.length > request.options.maxSteps) {
        steps = steps.slice(0, request.options.maxSteps);
      }

      const executionResult: ExecutionResult = {
        id: executionId,
        algorithmId: request.algorithmId,
        steps,
        output,
        executionTime: Date.now() - startTime,
        totalSteps: steps.length
      };

      this.executions.set(executionId, executionResult);
      return executionResult;

    } catch (error: any) {
      const executionResult: ExecutionResult = {
        id: executionId,
        algorithmId: request.algorithmId,
        steps: [],
        output: null,
        error: error.message,
        executionTime: Date.now() - startTime,
        totalSteps: 0
      };

      this.executions.set(executionId, executionResult);
      return executionResult;
    }
  }

  async getExecutionStatus(id: string): Promise<ExecutionResult | null> {
    return this.executions.get(id) || null;
  }

  async cancelExecution(id: string): Promise<boolean> {
    return this.executions.delete(id);
  }

  private getAlgorithmCategory(algorithmId: string): string {
    const sortingAlgos = ['bubble-sort', 'quick-sort', 'merge-sort', 'heap-sort', 
                          'insertion-sort', 'selection-sort', 'radix-sort', 'counting-sort',
                          'bucket-sort', 'shell-sort', 'cocktail-sort', 'comb-sort'];
    
    const searchingAlgos = ['linear-search', 'binary-search', 'jump-search', 
                            'interpolation-search', 'exponential-search', 'ternary-search',
                            'fibonacci-search'];
    
    const graphAlgos = ['bfs', 'dfs', 'dijkstra', 'bellman-ford', 'floyd-warshall',
                        'kruskal', 'prim'];
    
    const dpAlgos = ['fibonacci-dp', 'knapsack', 'lcs', 'edit-distance', 'coin-change',
                     'matrix-chain', 'lis'];
    
    const stringAlgos = ['naive-search', 'kmp', 'rabin-karp', 'boyer-moore', 
                         'z-algorithm', 'manacher'];

    if (sortingAlgos.includes(algorithmId)) return 'sorting';
    if (searchingAlgos.includes(algorithmId)) return 'searching';
    if (graphAlgos.includes(algorithmId)) return 'graph';
    if (dpAlgos.includes(algorithmId)) return 'dynamic-programming';
    if (stringAlgos.includes(algorithmId)) return 'string';
    
    return 'unknown';
  }

  private executeDPAlgorithm(algorithmId: string, input: any, executor: any): any[] {
    switch (algorithmId) {
      case 'fibonacci-dp':
        return executor(input.n || input);
      
      case 'knapsack':
        return executor(input.weights, input.values, input.capacity);
      
      case 'lcs':
        return executor(input.str1 || input.string1, input.str2 || input.string2);
      
      case 'edit-distance':
        return executor(input.str1 || input.string1, input.str2 || input.string2);
      
      case 'coin-change':
        return executor(input.coins, input.amount);
      
      case 'matrix-chain':
        return executor(input.dimensions || input);
      
      case 'lis':
        return executor(input.array || input);
      
      default:
        throw new Error(`Unknown DP algorithm: ${algorithmId}`);
    }
  }

  // Generate sample inputs for algorithms
  generateSampleInput(algorithmId: string): any {
    const category = this.getAlgorithmCategory(algorithmId);

    switch (category) {
      case 'sorting':
        return { array: this.generateRandomArray(10, 1, 100) };
      
      case 'searching':
        const sortedArray = this.generateRandomArray(10, 1, 100).sort((a, b) => a - b);
        return { 
          array: sortedArray, 
          target: sortedArray[Math.floor(Math.random() * sortedArray.length)] 
        };
      
      case 'graph':
        return this.generateSampleGraph();
      
      case 'dynamic-programming':
        return this.generateDPInput(algorithmId);
      
      case 'string':
        return { 
          text: 'ABABDABACDABABCABAB',
          pattern: 'ABABCABAB'
        };
      
      default:
        return {};
    }
  }

  private generateRandomArray(length: number, min: number, max: number): number[] {
    return Array.from({ length }, () => 
      Math.floor(Math.random() * (max - min + 1)) + min
    );
  }

  private generateSampleGraph(): any {
    const nodes = [
      { id: 'A', x: 100, y: 100 },
      { id: 'B', x: 200, y: 50 },
      { id: 'C', x: 300, y: 100 },
      { id: 'D', x: 200, y: 150 },
      { id: 'E', x: 250, y: 200 }
    ];

    const edges = [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'D', weight: 2 },
      { source: 'B', target: 'C', weight: 3 },
      { source: 'B', target: 'D', weight: 1 },
      { source: 'C', target: 'E', weight: 5 },
      { source: 'D', target: 'E', weight: 3 }
    ];

    return { nodes, edges, startNode: 'A' };
  }

  private generateDPInput(algorithmId: string): any {
    switch (algorithmId) {
      case 'fibonacci-dp':
        return { n: 10 };
      
      case 'knapsack':
        return {
          weights: [2, 3, 4, 5],
          values: [3, 4, 5, 6],
          capacity: 8
        };
      
      case 'lcs':
        return { str1: 'ABCDGH', str2: 'AEDFHR' };
      
      case 'edit-distance':
        return { str1: 'sunday', str2: 'saturday' };
      
      case 'coin-change':
        return { coins: [1, 2, 5], amount: 11 };
      
      case 'matrix-chain':
        return { dimensions: [10, 20, 30, 40, 30] };
      
      case 'lis':
        return { array: [10, 9, 2, 5, 3, 7, 101, 18] };
      
      default:
        return {};
    }
  }

  // Validate inputs based on algorithm requirements
  validateInput(algorithmId: string, input: any): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    try {
      const category = this.getAlgorithmCategory(algorithmId);

      switch (category) {
        case 'sorting':
          if (!input.array || !Array.isArray(input.array)) {
            errors.push('Input must have an array property');
          }
          if (input.array && !input.array.every((n: any) => typeof n === 'number')) {
            errors.push('Array must contain only numbers');
          }
          break;

        case 'searching':
          if (!input.array || !Array.isArray(input.array)) {
            errors.push('Input must have an array property');
          }
          if (input.target === undefined) {
            errors.push('Input must have a target value');
          }
          if (algorithmId !== 'linear-search' && !this.isSorted(input.array)) {
            errors.push('Array must be sorted for this search algorithm');
          }
          break;

        case 'graph':
          if (!input.nodes || !Array.isArray(input.nodes)) {
            errors.push('Input must have a nodes array');
          }
          if (!input.edges || !Array.isArray(input.edges)) {
            errors.push('Input must have an edges array');
          }
          if (['bfs', 'dfs', 'dijkstra', 'bellman-ford', 'prim'].includes(algorithmId)) {
            if (!input.startNode) {
              errors.push('Input must have a startNode property');
            }
          }
          break;

        case 'string':
          if (!input.text || typeof input.text !== 'string') {
            errors.push('Input must have a text string');
          }
          if (!input.pattern || typeof input.pattern !== 'string') {
            errors.push('Input must have a pattern string');
          }
          break;
      }

      return { valid: errors.length === 0, errors };
    } catch (error: any) {
      return { valid: false, errors: [error.message] };
    }
  }

  private isSorted(arr: number[]): boolean {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  }
}

export const comprehensiveExecutionService = new ComprehensiveExecutionService();
