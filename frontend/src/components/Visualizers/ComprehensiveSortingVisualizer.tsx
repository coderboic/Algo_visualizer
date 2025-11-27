import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

interface VisualizationStep {
  type: string;
  array: number[];
  comparing?: number[];
  swapping?: number[];
  sorted?: number[];
  highlightedIndices?: number[];
  pivot?: number;
  description: string;
}

interface ComprehensiveSortingVisualizerProps {
  algorithmId: string;
  initialArray?: number[];
  onComplete?: () => void;
}

export const ComprehensiveSortingVisualizer: React.FC<ComprehensiveSortingVisualizerProps> = ({
  algorithmId,
  initialArray,
  onComplete
}) => {
  const [array, setArray] = useState<number[]>(initialArray || []);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(500); // milliseconds
  const [arraySize, setArraySize] = useState(20);
  const [maxValue, setMaxValue] = useState(100);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array
  const generateArray = () => {
    const newArray = Array.from(
      { length: arraySize },
      () => Math.floor(Math.random() * maxValue) + 1
    );
    setArray(newArray);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Execute sorting algorithm
  const executeSorting = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/execute/algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithmId,
          input: { array }
        })
      });

      const result = await response.json();
      setSteps(result.steps || []);
      setCurrentStep(0);
    } catch (error) {
      console.error('Error executing algorithm:', error);
    }
  };

  // Play/pause animation
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Reset visualization
  const reset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Step forward
  const stepForward = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Step backward
  const stepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Animation effect
  useEffect(() => {
    if (isPlaying && currentStep < steps.length - 1) {
      timeoutRef.current = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    } else if (currentStep >= steps.length - 1) {
      setIsPlaying(false);
      onComplete?.();
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isPlaying, currentStep, steps.length, speed, onComplete]);

  // Initialize
  useEffect(() => {
    if (!initialArray) {
      generateArray();
    }
  }, []);

  const currentStepData = steps[currentStep];
  const displayArray = currentStepData?.array || array;

  const getBarColor = (index: number): string => {
    if (!currentStepData) return 'bg-blue-500';

    if (currentStepData.sorted?.includes(index)) return 'bg-green-500';
    if (currentStepData.swapping?.includes(index)) return 'bg-red-500';
    if (currentStepData.comparing?.includes(index)) return 'bg-yellow-500';
    if (currentStepData.highlightedIndices?.includes(index)) return 'bg-purple-500';
    if (currentStepData.pivot === index) return 'bg-orange-500';

    return 'bg-blue-500';
  };

  const maxArrayValue = Math.max(...displayArray, 1);

  return (
    <div className="w-full h-full flex flex-col bg-gray-900 text-white p-6 rounded-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {algorithmId.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
        </h2>
        <p className="text-gray-400">
          Step {currentStep + 1} of {steps.length || 1}
        </p>
      </div>

      {/* Visualization Canvas */}
      <div className="flex-1 flex items-end justify-center gap-1 mb-6 px-4 min-h-[300px]">
        {displayArray.map((value, index) => {
          const heightPercent = (value / maxArrayValue) * 100;
          const barColor = getBarColor(index);

          return (
            <div
              key={index}
              className="flex flex-col items-center justify-end flex-1 min-w-[4px] max-w-[80px]"
            >
              <div className="text-xs mb-1 text-gray-400 font-mono">
                {value}
              </div>
              <div
                className={`w-full ${barColor} transition-all duration-200 rounded-t flex items-end justify-center`}
                style={{ height: `${Math.max(heightPercent, 5)}%` }}
              >
                <span className="text-[10px] font-bold mb-1 opacity-75">
                  {index}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Description */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 min-h-[60px]">
        <p className="text-sm">
          {currentStepData?.description || 'Click "Start Sorting" to begin visualization'}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Playback Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={stepBackward}
            disabled={currentStep === 0}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition"
            title="Step Backward"
          >
            <SkipBack size={20} />
          </button>

          <button
            onClick={togglePlay}
            disabled={steps.length === 0 || currentStep >= steps.length - 1}
            className="p-2 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 disabled:opacity-50 rounded transition"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause size={20} /> : <Play size={20} />}
          </button>

          <button
            onClick={stepForward}
            disabled={currentStep >= steps.length - 1}
            className="p-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:opacity-50 rounded transition"
            title="Step Forward"
          >
            <SkipForward size={20} />
          </button>

          <button
            onClick={reset}
            className="p-2 bg-gray-700 hover:bg-gray-600 rounded transition"
            title="Reset"
          >
            <RotateCcw size={20} />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={executeSorting}
            disabled={isPlaying}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:opacity-50 rounded transition font-semibold"
          >
            Start Sorting
          </button>

          <button
            onClick={generateArray}
            disabled={isPlaying}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:opacity-50 rounded transition font-semibold"
          >
            New Array
          </button>
        </div>
      </div>

      {/* Settings */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">
            Speed: {1000 - speed}ms
          </label>
          <input
            type="range"
            min="50"
            max="950"
            value={1000 - speed}
            onChange={(e) => setSpeed(1000 - parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Array Size: {arraySize}
          </label>
          <input
            type="range"
            min="5"
            max="100"
            value={arraySize}
            onChange={(e) => {
              setArraySize(parseInt(e.target.value));
              setSteps([]);
              setCurrentStep(0);
            }}
            className="w-full"
            disabled={isPlaying}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Max Value: {maxValue}
          </label>
          <input
            type="range"
            min="10"
            max="500"
            value={maxValue}
            onChange={(e) => {
              setMaxValue(parseInt(e.target.value));
              setSteps([]);
              setCurrentStep(0);
            }}
            className="w-full"
            disabled={isPlaying}
          />
        </div>
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span>Unsorted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-500 rounded"></div>
          <span>Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span>Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-purple-500 rounded"></div>
          <span>Highlighted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-500 rounded"></div>
          <span>Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded"></div>
          <span>Sorted</span>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveSortingVisualizer;
