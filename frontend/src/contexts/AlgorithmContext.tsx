import React, { createContext, useContext, useState, useCallback } from 'react';
import { algorithmService } from '../services/algorithmService';

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
}

export interface VisualizationStep {
  type: string;
  array?: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  description: string;
  [key: string]: any;
}

interface AlgorithmContextType {
  algorithms: Algorithm[];
  currentAlgorithm: Algorithm | null;
  visualizationSteps: VisualizationStep[];
  currentStep: number;
  isPlaying: boolean;
  speed: number;
  loading: boolean;
  error: string | null;
  
  // Actions
  loadAlgorithms: () => Promise<void>;
  selectAlgorithm: (algorithmId: string) => void;
  generateVisualization: (input: any) => Promise<void>;
  setCurrentStep: (step: number) => void;
  play: () => void;
  pause: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  stepForward: () => void;
  stepBackward: () => void;
}

const AlgorithmContext = createContext<AlgorithmContextType | undefined>(undefined);

export const useAlgorithm = () => {
  const context = useContext(AlgorithmContext);
  if (!context) {
    throw new Error('useAlgorithm must be used within an AlgorithmProvider');
  }
  return context;
};

interface AlgorithmProviderProps {
  children: React.ReactNode;
}

export const AlgorithmProvider: React.FC<AlgorithmProviderProps> = ({ children }) => {
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [currentAlgorithm, setCurrentAlgorithm] = useState<Algorithm | null>(null);
  const [visualizationSteps, setVisualizationSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // milliseconds per step
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAlgorithms = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await algorithmService.getAllAlgorithms();
      setAlgorithms(data);
    } catch (err) {
      setError('Failed to load algorithms');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const selectAlgorithm = useCallback((algorithmId: string) => {
    const algorithm = algorithms.find(a => a.id === algorithmId);
    if (algorithm) {
      setCurrentAlgorithm(algorithm);
      setVisualizationSteps([]);
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [algorithms]);

  const generateVisualization = useCallback(async (input: any) => {
    if (!currentAlgorithm) return;
    
    try {
      setLoading(true);
      setError(null);
      const steps = await algorithmService.generateVisualization(
        currentAlgorithm.id,
        input
      );
      setVisualizationSteps(steps);
      setCurrentStep(0);
    } catch (err) {
      setError('Failed to generate visualization');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentAlgorithm]);

  const play = useCallback(() => {
    if (currentStep >= visualizationSteps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  }, [currentStep, visualizationSteps]);

  const pause = useCallback(() => {
    setIsPlaying(false);
  }, []);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setIsPlaying(false);
  }, []);

  const stepForward = useCallback(() => {
    if (currentStep < visualizationSteps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  }, [currentStep, visualizationSteps]);

  const stepBackward = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  // Auto-play logic
  React.useEffect(() => {
    if (!isPlaying) return;
    
    if (currentStep >= visualizationSteps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const timer = setTimeout(() => {
      setCurrentStep(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, visualizationSteps, speed]);

  const value: AlgorithmContextType = {
    algorithms,
    currentAlgorithm,
    visualizationSteps,
    currentStep,
    isPlaying,
    speed,
    loading,
    error,
    loadAlgorithms,
    selectAlgorithm,
    generateVisualization,
    setCurrentStep,
    play,
    pause,
    reset,
    setSpeed,
    stepForward,
    stepBackward
  };

  return (
    <AlgorithmContext.Provider value={value}>
      {children}
    </AlgorithmContext.Provider>
  );
};