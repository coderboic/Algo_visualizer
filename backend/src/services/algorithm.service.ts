import { algorithms } from '../data/algorithms';

export interface Algorithm {
  id: string;
  name: string;
  category: string;
  description: string;
  complexity: {
    time: string;
    space: string;
  };
  code?: string;
  examples?: any[];
}

class AlgorithmService {
  private algorithms: Algorithm[] = algorithms;

  async getAllAlgorithms(): Promise<Algorithm[]> {
    return this.algorithms;
  }

  async getAlgorithmById(id: string): Promise<Algorithm | undefined> {
    return this.algorithms.find(algo => algo.id === id);
  }

  async getAlgorithmsByCategory(category: string): Promise<Algorithm[]> {
    return this.algorithms.filter(algo => 
      algo.category.toLowerCase() === category.toLowerCase()
    );
  }

  async getAlgorithmExample(id: string): Promise<any> {
    const algorithm = await this.getAlgorithmById(id);
    if (!algorithm) return null;
    
    return {
      code: algorithm.code,
      examples: algorithm.examples,
      input: this.getDefaultInput(algorithm.category)
    };
  }

  private getDefaultInput(category: string): any {
    switch (category.toLowerCase()) {
      case 'sorting':
        return { array: [64, 34, 25, 12, 22, 11, 90] };
      case 'searching':
        return { array: [1, 3, 5, 7, 9, 11, 13], target: 7 };
      case 'graph':
        return {
          nodes: ['A', 'B', 'C', 'D'],
          edges: [
            { from: 'A', to: 'B', weight: 1 },
            { from: 'B', to: 'C', weight: 2 },
            { from: 'A', to: 'C', weight: 4 },
            { from: 'C', to: 'D', weight: 1 }
          ]
        };
      case 'tree':
        return {
          root: {
            value: 10,
            left: { value: 5, left: { value: 3 }, right: { value: 7 } },
            right: { value: 15, left: { value: 12 }, right: { value: 20 } }
          }
        };
      default:
        return {};
    }
  }
}

export const algorithmService = new AlgorithmService();