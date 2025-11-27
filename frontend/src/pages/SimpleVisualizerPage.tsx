import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getAllAlgorithms } from '../data/algorithms';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SimpleVisualizerPage: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();

  const [array, setArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 45, 50]);
  const [steps, setSteps] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500);
  const [comparing, setComparing] = useState<number[]>([]);
  const [sorted, setSorted] = useState<number[]>([]);
  const [swapping, setSwapping] = useState<number[]>([]);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);

  // Find the algorithm from local data
  const allAlgorithms = getAllAlgorithms();
  const currentAlgorithm = allAlgorithms.find(alg => alg.id === algorithmId);

  // Fetch visualization steps from backend
  const fetchVisualizationSteps = async () => {
    if (!algorithmId) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/execute/algorithm`, {
        algorithmId: algorithmId,
        input: { array: array },
        options: {}
      });

      if (response.data && response.data.steps) {
        setSteps(response.data.steps);
        setCurrentStep(0);
      } else {
        // Fallback to local bubble sort if backend fails
        generateLocalSteps();
      }
    } catch (err) {
      console.error('Error fetching visualization:', err);
      // Fallback to local visualization
      generateLocalSteps();
    } finally {
      setLoading(false);
    }
  };

  // Local bubble sort as fallback
  const generateLocalSteps = () => {
    const arr = [...array];
    const localSteps: any[] = [];
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        // Comparing step
        localSteps.push({
          array: [...arr],
          comparing: [j, j + 1],
          sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
          description: `Comparing ${arr[j]} and ${arr[j + 1]}`
        });

        if (arr[j] > arr[j + 1]) {
          // Swapping step
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          localSteps.push({
            array: [...arr],
            swapping: [j, j + 1],
            sorted: Array.from({ length: i }, (_, idx) => n - 1 - idx),
            description: `Swapping ${arr[j + 1]} and ${arr[j]}`
          });
        }
      }
    }

    // Final sorted state
    localSteps.push({
      array: [...arr],
      sorted: Array.from({ length: n }, (_, idx) => idx),
      description: 'Array is fully sorted!'
    });

    setSteps(localSteps);
    setCurrentStep(0);
  };

  // Initial load
  useEffect(() => {
    if (algorithmId) {
      fetchVisualizationSteps();
    }
  }, [algorithmId]);

  // Update visualization state based on current step
  useEffect(() => {
    if (steps.length > 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      if (step) {
        setArray(step.array || array);
        setComparing(step.comparing || step.highlightedIndices || []);
        setSorted(step.sorted || []);
        setSwapping(step.swapping || []);
      }
    }
  }, [currentStep, steps]);

  // Animation effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isPlaying && currentStep < steps.length - 1) {
      interval = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
    }

    return () => clearTimeout(interval);
  }, [isPlaying, currentStep, steps.length, speed]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: 10 }, () => Math.floor(Math.random() * 100) + 1);
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handlePlay = () => {
    if (currentStep >= steps.length - 1) {
      setCurrentStep(0);
    }
    setIsPlaying(true);
  };

  const handlePause = () => {
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  if (!currentAlgorithm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Algorithm not found</h2>
          <button
            onClick={() => navigate('/algorithms')}
            className="btn-primary"
          >
            Back to Algorithms
          </button>
        </div>
      </div>
    );
  }

  const getBarColor = (index: number) => {
    if (sorted.includes(index)) return 'bg-green-500';
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-500';
    return 'bg-blue-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gradient">{currentAlgorithm.name}</h1>
            <p className="text-gray-600 dark:text-gray-300">{currentAlgorithm.description}</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Time Complexity</div>
              <div className="font-mono text-sm font-bold text-red-600 dark:text-red-400">{currentAlgorithm.complexity.time}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Space Complexity</div>
              <div className="font-mono text-sm font-bold text-blue-600 dark:text-blue-400">{currentAlgorithm.complexity.space}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Visualization Area */}
      <div className="container mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
          {/* Array Input Controls */}
          <div className="mb-8 flex gap-4 items-center">
            <button
              onClick={generateRandomArray}
              className="btn-primary"
            >
              Generate Random Array
            </button>
            <div className="text-gray-600 dark:text-gray-300">
              Current Array: [{array.join(', ')}]
            </div>
          </div>

          {/* Visualization */}
          <div className="mb-8">
            <div className="flex items-end justify-center gap-2" style={{ height: '400px' }}>
              {steps.length > 0 && currentStep < steps.length && steps[currentStep].array.map((value: number, index: number) => (
                <div
                  key={index}
                  className="relative flex flex-col items-center"
                  style={{ width: `${100 / array.length}%`, maxWidth: '60px' }}
                >
                  <div
                    className={`w-full ${getBarColor(index)} transition-all duration-300 rounded-t-lg`}
                    style={{ height: `${(value / 100) * 350}px` }}
                  />
                  <div className="mt-2 text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {value}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step Description */}
          <div className="mb-8 text-center">
            <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
              {steps[currentStep]?.description || 'Ready to start'}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Step {currentStep + 1} of {steps.length}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={handleStepBackward}
              disabled={currentStep === 0}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            {!isPlaying ? (
              <button
                onClick={handlePlay}
                className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="p-3 rounded-lg bg-yellow-600 text-white hover:bg-yellow-700 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}

            <button
              onClick={handleReset}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>

            <button
              onClick={handleStepForward}
              disabled={currentStep >= steps.length - 1}
              className="p-3 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Speed Control */}
          <div className="mt-6 flex items-center justify-center gap-4">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Speed:</label>
            <input
              type="range"
              min="100"
              max="2000"
              step="100"
              value={2100 - speed}
              onChange={(e) => setSpeed(2100 - parseInt(e.target.value))}
              className="w-48"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400">{speed}ms</span>
          </div>

          {/* Legend */}
          <div className="mt-8 flex justify-center gap-6 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Unsorted</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Comparing</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-red-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Swapping</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span className="text-gray-600 dark:text-gray-400">Sorted</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleVisualizerPage;