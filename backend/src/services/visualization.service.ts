import { v4 as uuidv4 } from 'uuid';
import { algorithmService } from './algorithm.service';
import { sortingAlgorithms } from '../algorithms/sorting';
import { searchingAlgorithms } from '../algorithms/searching';
import { graphAlgorithms } from '../algorithms/graph';

interface VisualizationRequest {
  algorithm: string;
  input: any;
  options?: any;
}

interface VisualizationData {
  id: string;
  algorithmId: string;
  inputData: any;
  steps: any[];
  userId?: string;
  isPublic?: boolean;
  createdAt: Date;
}

class VisualizationService {
  private visualizations: Map<string, VisualizationData> = new Map();

  async generateVisualization(request: VisualizationRequest): Promise<any> {
    const { algorithm, input } = request;
    
    // Get algorithm details
    const algorithmDetails = await algorithmService.getAlgorithmById(algorithm);
    if (!algorithmDetails) {
      throw new Error('Algorithm not found');
    }

    // Generate visualization steps based on algorithm category
    let steps: any[] = [];
    
    switch (algorithmDetails.category.toLowerCase()) {
      case 'sorting':
        steps = await this.generateSortingVisualization(algorithm, input);
        break;
      case 'searching':
        steps = await this.generateSearchingVisualization(algorithm, input);
        break;
      case 'graph':
        steps = await this.generateGraphVisualization(algorithm, input);
        break;
      case 'tree':
        steps = await this.generateTreeVisualization(algorithm, input);
        break;
      default:
        throw new Error('Unsupported algorithm category');
    }

    return {
      algorithm: algorithmDetails,
      input,
      steps,
      totalSteps: steps.length
    };
  }

  async getVisualization(id: string): Promise<VisualizationData | null> {
    return this.visualizations.get(id) || null;
  }

  async saveVisualization(data: Omit<VisualizationData, 'id' | 'createdAt'>): Promise<VisualizationData> {
    const visualization: VisualizationData = {
      ...data,
      id: uuidv4(),
      createdAt: new Date()
    };

    this.visualizations.set(visualization.id, visualization);
    return visualization;
  }

  async getAllVisualizations(params: { limit: number; offset: number; isPublic: boolean }): Promise<VisualizationData[]> {
    const allVisualizations = Array.from(this.visualizations.values());
    const filtered = allVisualizations.filter(v => v.isPublic === params.isPublic);
    
    return filtered.slice(params.offset, params.offset + params.limit);
  }

  private async generateSortingVisualization(algorithm: string, input: any): Promise<any[]> {
    const array = [...input.array];

    switch (algorithm) {
      case 'bubble-sort':
        return sortingAlgorithms.bubbleSort(array);
      case 'quick-sort':
        return sortingAlgorithms.quickSort(array);
      case 'merge-sort':
        return sortingAlgorithms.mergeSort(array);
      case 'heap-sort':
        return sortingAlgorithms.heapSort(array);
      default:
        return this.generateGenericSortingSteps(array);
    }
  }

  private async generateSearchingVisualization(algorithm: string, input: any): Promise<any[]> {
    const { array, target } = input;
    
    switch (algorithm) {
      case 'binary-search':
        return searchingAlgorithms.binarySearch(array, target);
      case 'linear-search':
        return searchingAlgorithms.linearSearch(array, target);
      default:
        return this.generateGenericSearchingSteps(array, target);
    }
  }

  private async generateGraphVisualization(algorithm: string, input: any): Promise<any[]> {
    switch (algorithm) {
      case 'bfs':
        return graphAlgorithms.bfs(input);
      case 'dfs':
        return graphAlgorithms.dfs(input);
      case 'dijkstra':
        return graphAlgorithms.dijkstra(input);
      default:
        return [];
    }
  }

  private async generateTreeVisualization(_algorithm: string, _input: any): Promise<any[]> {
    // Tree visualization logic
    return [];
  }

  private generateGenericSortingSteps(array: number[]): any[] {
    const steps: any[] = [];
    const arr = [...array];
    
    // Simple bubble sort for demonstration
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({
          type: 'compare',
          array: [...arr],
          comparing: [j, j + 1],
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          steps.push({
            type: 'swap',
            array: [...arr],
            swapping: [j, j + 1],
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`
          });
        }
      }
      
      steps.push({
        type: 'sorted',
        array: [...arr],
        sorted: arr.length - i - 1,
        description: `Element at position ${arr.length - i - 1} is now sorted`
      });
    }
    
    return steps;
  }

  private generateGenericSearchingSteps(array: number[], target: number): any[] {
    const steps: any[] = [];
    
    for (let i = 0; i < array.length; i++) {
      steps.push({
        type: 'check',
        array: [...array],
        checking: i,
        target,
        description: `Checking if ${array[i]} equals ${target}`
      });
      
      if (array[i] === target) {
        steps.push({
          type: 'found',
          array: [...array],
          foundAt: i,
          target,
          description: `Found ${target} at index ${i}`
        });
        break;
      }
    }
    
    if (steps[steps.length - 1]?.type !== 'found') {
      steps.push({
        type: 'not-found',
        array: [...array],
        target,
        description: `${target} not found in the array`
      });
    }
    
    return steps;
  }
}

export const visualizationService = new VisualizationService();