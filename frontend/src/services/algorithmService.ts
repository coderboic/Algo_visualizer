import axios from 'axios';
import type { Algorithm, VisualizationStep } from '../contexts/AlgorithmContext';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class AlgorithmService {
  private api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  async getAllAlgorithms(): Promise<Algorithm[]> {
    try {
      const response = await this.api.get('/algorithms');
      return response.data.data;
    } catch (error) {
      console.error('Error fetching algorithms:', error);
      throw error;
    }
  }

  async getAlgorithmById(id: string): Promise<Algorithm> {
    try {
      const response = await this.api.get(`/algorithms/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching algorithm:', error);
      throw error;
    }
  }

  async getAlgorithmsByCategory(category: string): Promise<Algorithm[]> {
    try {
      const response = await this.api.get(`/algorithms/category/${category}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching algorithms by category:', error);
      throw error;
    }
  }

  async getAlgorithmExample(id: string): Promise<any> {
    try {
      const response = await this.api.get(`/algorithms/${id}/example`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching algorithm example:', error);
      throw error;
    }
  }

  async generateVisualization(algorithmId: string, input: any): Promise<VisualizationStep[]> {
    try {
      const response = await this.api.post('/visualize', {
        algorithm: algorithmId,
        input,
      });
      return response.data.data.steps;
    } catch (error) {
      console.error('Error generating visualization:', error);
      throw error;
    }
  }

  async executeCode(code: string, language: string = 'javascript', input?: any): Promise<any> {
    try {
      const response = await this.api.post('/execute', {
        code,
        language,
        input,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error executing code:', error);
      throw error;
    }
  }

  async validateCode(code: string, language: string = 'javascript'): Promise<any> {
    try {
      const response = await this.api.post('/execute/validate', {
        code,
        language,
      });
      return response.data.data;
    } catch (error) {
      console.error('Error validating code:', error);
      throw error;
    }
  }

  async saveVisualization(data: {
    algorithmId: string;
    inputData: any;
    steps: any[];
    userId?: string;
    isPublic?: boolean;
  }): Promise<any> {
    try {
      const response = await this.api.post('/visualize/save', data);
      return response.data.data;
    } catch (error) {
      console.error('Error saving visualization:', error);
      throw error;
    }
  }

  async getVisualization(id: string): Promise<any> {
    try {
      const response = await this.api.get(`/visualize/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error fetching visualization:', error);
      throw error;
    }
  }
}

export const algorithmService = new AlgorithmService();