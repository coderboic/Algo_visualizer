import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Shuffle } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import {
  nextStep,
  previousStep,
  play,
  pause,
  reset,
  setSpeed,
  setInputData,
} from '../../store/slices/visualizationSlice';

interface Bar {
  value: number;
  index: number;
  isComparing?: boolean;
  isSwapping?: boolean;
  isSorted?: boolean;
  isPivot?: boolean;
}

interface SortingVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number) => void;
}

const SortingVisualizer: React.FC<SortingVisualizerProps> = ({ algorithm, onStepChange }) => {
  const dispatch = useAppDispatch();
  const { steps, currentStepIndex, isPlaying } = useAppSelector(
    (state) => state.visualization
  );
  
  const [bars, setBars] = useState<Bar[]>([]);
  const [arraySize, setArraySize] = useState(30);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate random array
  const generateRandomArray = useCallback(() => {
    const newArray = Array.from({ length: arraySize }, (_, i) => ({
      value: Math.floor(Math.random() * 400) + 10,
      index: i,
    }));
    setBars(newArray);
    dispatch(setInputData(newArray.map(b => b.value)));
    dispatch(reset());
  }, [arraySize, dispatch]);

  // Initialize array on mount
  useEffect(() => {
    generateRandomArray();
  }, [generateRandomArray]);

  // Handle play/pause animation
  useEffect(() => {
    if (isPlaying && steps.length > 0) {
      intervalRef.current = setInterval(() => {
        if (currentStepIndex < steps.length - 1) {
          dispatch(nextStep());
        } else {
          dispatch(pause());
        }
      }, animationSpeed);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPlaying, currentStepIndex, steps.length, animationSpeed, dispatch]);

  // Update bars based on current step
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex]) {
      const currentStep = steps[currentStepIndex];
      const updatedBars = bars.map((bar, index) => ({
        ...bar,
        isComparing: currentStep.comparedIndices?.includes(index),
        isSwapping: currentStep.swappedIndices?.includes(index),
        isSorted: currentStep.data?.[index]?.isSorted,
        isPivot: currentStep.data?.[index]?.isPivot,
        value: currentStep.data?.[index]?.value || bar.value,
      }));
      setBars(updatedBars);
      onStepChange?.(currentStepIndex);
    }
  }, [currentStepIndex, steps, onStepChange]);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };

  const handleReset = () => {
    dispatch(reset());
    generateRandomArray();
  };

  const handleStepForward = () => {
    dispatch(nextStep());
  };

  const handleStepBackward = () => {
    dispatch(previousStep());
  };

  const handleSpeedChange = (newSpeed: number) => {
    setAnimationSpeed(1100 - newSpeed * 10);
    dispatch(setSpeed(1100 - newSpeed * 10));
  };

  const handleSizeChange = (newSize: number) => {
    setArraySize(newSize);
    generateRandomArray();
  };

  const getBarColor = (bar: Bar) => {
    if (bar.isSorted) return 'bg-green-500';
    if (bar.isSwapping) return 'bg-red-500';
    if (bar.isComparing) return 'bg-yellow-500';
    if (bar.isPivot) return 'bg-purple-500';
    return 'bg-blue-500';
  };

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Visualization Area */}
      <div className="flex-1 flex items-end justify-center space-x-1 mb-8 min-h-[400px]">
        {bars.map((bar, index) => (
          <motion.div
            key={`${bar.index}-${index}`}
            className={`relative ${getBarColor(bar)} rounded-t transition-colors duration-300`}
            style={{
              height: `${(bar.value / 410) * 100}%`,
              width: `${100 / bars.length}%`,
              minWidth: '2px',
            }}
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.3, delay: index * 0.01 }}
          >
            {bars.length <= 20 && (
              <span className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                {bar.value}
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Playback Controls */}
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={handleReset}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
          
          <button
            onClick={handleStepBackward}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={currentStepIndex === 0}
            title="Previous Step"
          >
            <SkipBack className="h-5 w-5" />
          </button>

          <button
            onClick={handlePlayPause}
            className="p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
          </button>

          <button
            onClick={handleStepForward}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            disabled={currentStepIndex >= steps.length - 1}
            title="Next Step"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          <button
            onClick={generateRandomArray}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Generate New Array"
          >
            <Shuffle className="h-5 w-5" />
          </button>
        </div>

        {/* Speed and Size Controls */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Animation Speed: {animationSpeed}ms
            </label>
            <input
              type="range"
              min="1"
              max="100"
              value={(1100 - animationSpeed) / 10}
              onChange={(e) => handleSpeedChange(parseInt(e.target.value))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Array Size: {arraySize}
            </label>
            <input
              type="range"
              min="5"
              max="100"
              value={arraySize}
              onChange={(e) => handleSizeChange(parseInt(e.target.value))}
              className="w-full"
              disabled={isPlaying}
            />
          </div>
        </div>

        {/* Step Information */}
        {steps.length > 0 && steps[currentStepIndex] && (
          <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Step {currentStepIndex + 1} of {steps.length}
              </span>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {algorithm}
              </span>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {steps[currentStepIndex].description}
            </p>
            {steps[currentStepIndex].code && (
              <pre className="mt-2 text-xs bg-gray-900 text-gray-100 p-2 rounded overflow-x-auto">
                <code>{steps[currentStepIndex].code}</code>
              </pre>
            )}
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Default</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Comparing</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Swapping</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-purple-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Pivot</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SortingVisualizer;