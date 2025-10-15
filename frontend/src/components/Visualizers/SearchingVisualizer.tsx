import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Search, Shuffle } from 'lucide-react';

interface ArrayElement {
  value: number;
  index: number;
  isComparing?: boolean;
  isFound?: boolean;
  isInRange?: boolean;
  isMid?: boolean;
}

interface VisualizationStep {
  type: string;
  array: number[];
  target: number;
  description: string;
  currentIndex?: number;
  comparing?: number[];
  found?: boolean;
  foundIndex?: number;
  range?: number[];
  midIndex?: number;
}

const SearchingVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(800);
  const [targetValue, setTargetValue] = useState('');
  const [algorithm, setAlgorithm] = useState<'linear' | 'binary'>('linear');
  const [arraySize, setArraySize] = useState(12);

  // Initialize sorted array for binary search
  const generateSortedArray = () => {
    const newArray = Array.from({ length: arraySize }, (_, i) => (i + 1) * 5);
    setArray(newArray.map((val, idx) => ({ value: val, index: idx })));
    setSteps([]);
    setCurrentStepIndex(0);
  };

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setArray(newArray.map((val, idx) => ({ value: val, index: idx })));
    setSteps([]);
    setCurrentStepIndex(0);
  };

  useEffect(() => {
    generateSortedArray();
  }, []);

  // Animation loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && currentStepIndex < steps.length - 1) {
      interval = setInterval(() => {
        setCurrentStepIndex(prev => prev + 1);
      }, speed);
    } else if (currentStepIndex >= steps.length - 1) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentStepIndex, steps.length, speed]);

  // Update visualization based on current step
  useEffect(() => {
    if (steps.length > 0 && steps[currentStepIndex]) {
      const step = steps[currentStepIndex];
      const updatedArray = step.array.map((val, idx) => ({
        value: val,
        index: idx,
        isComparing: step.comparing?.includes(idx),
        isFound: step.found && step.foundIndex === idx,
        isInRange: step.range && idx >= step.range[0] && idx <= step.range[1],
        isMid: step.midIndex === idx,
      }));
      setArray(updatedArray);
    }
  }, [currentStepIndex, steps]);

  const linearSearch = (arr: number[], target: number): VisualizationStep[] => {
    const searchSteps: VisualizationStep[] = [];
    
    searchSteps.push({
      type: 'start',
      array: arr,
      target,
      description: `Starting Linear Search for ${target}. Checking each element sequentially...`
    });

    for (let i = 0; i < arr.length; i++) {
      searchSteps.push({
        type: 'compare',
        array: arr,
        target,
        currentIndex: i,
        comparing: [i],
        description: `Step ${i + 1}: Comparing element at index ${i} (${arr[i]}) with target ${target}`
      });

      if (arr[i] === target) {
        searchSteps.push({
          type: 'found',
          array: arr,
          target,
          found: true,
          foundIndex: i,
          comparing: [i],
          description: `✓ Success! Found ${target} at index ${i} after ${i + 1} comparisons`
        });
        return searchSteps;
      }
    }

    searchSteps.push({
      type: 'not-found',
      array: arr,
      target,
      found: false,
      description: `✗ Target ${target} not found in array after checking all ${arr.length} elements`
    });

    return searchSteps;
  };

  const binarySearch = (arr: number[], target: number): VisualizationStep[] => {
    const searchSteps: VisualizationStep[] = [];
    let left = 0;
    let right = arr.length - 1;
    let stepCount = 0;

    searchSteps.push({
      type: 'start',
      array: arr,
      target,
      range: [left, right],
      description: `Starting Binary Search for ${target}. Array must be sorted. Initial range: [${left}, ${right}]`
    });

    while (left <= right) {
      stepCount++;
      const mid = Math.floor((left + right) / 2);
      
      searchSteps.push({
        type: 'calculate-mid',
        array: arr,
        target,
        range: [left, right],
        midIndex: mid,
        comparing: [mid],
        description: `Step ${stepCount}: Searching range [${left}, ${right}]. Middle index = ${mid}, value = ${arr[mid]}`
      });

      if (arr[mid] === target) {
        searchSteps.push({
          type: 'found',
          array: arr,
          target,
          found: true,
          foundIndex: mid,
          comparing: [mid],
          description: `✓ Success! Found ${target} at index ${mid} in ${stepCount} steps`
        });
        return searchSteps;
      }

      if (arr[mid] < target) {
        searchSteps.push({
          type: 'search-right',
          array: arr,
          target,
          range: [left, right],
          midIndex: mid,
          description: `${arr[mid]} < ${target}, searching right half. New range: [${mid + 1}, ${right}]`
        });
        left = mid + 1;
      } else {
        searchSteps.push({
          type: 'search-left',
          array: arr,
          target,
          range: [left, right],
          midIndex: mid,
          description: `${arr[mid]} > ${target}, searching left half. New range: [${left}, ${mid - 1}]`
        });
        right = mid - 1;
      }
    }

    searchSteps.push({
      type: 'not-found',
      array: arr,
      target,
      found: false,
      description: `✗ Target ${target} not found in array. Completed in ${stepCount} steps`
    });

    return searchSteps;
  };

  const handleSearch = () => {
    if (!targetValue) return;
    const target = parseInt(targetValue);
    if (isNaN(target)) return;

    const currentArray = array.map(el => el.value);
    let searchSteps: VisualizationStep[];

    if (algorithm === 'linear') {
      searchSteps = linearSearch(currentArray, target);
    } else {
      // Ensure array is sorted for binary search
      const sortedArray = [...currentArray].sort((a, b) => a - b);
      setArray(sortedArray.map((val, idx) => ({ value: val, index: idx })));
      searchSteps = binarySearch(sortedArray, target);
    }

    setSteps(searchSteps);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentDescription = steps[currentStepIndex]?.description || 'Enter a target value and click Search to begin';

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Search Algorithm Visualization</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Compare Linear Search (O(n)) and Binary Search (O(log n)) algorithms
        </p>
      </div>

      {/* Array Display */}
      <div className="flex-1 flex items-center justify-center mb-6 overflow-x-auto">
        <div className="flex gap-2 p-4">
          {array.map((element, idx) => (
            <motion.div
              key={idx}
              animate={{ 
                scale: element.isComparing || element.isMid ? 1.15 : 1,
                backgroundColor: 
                  element.isFound ? '#10b981' : // Green for found
                  element.isMid ? '#f59e0b' :   // Orange for mid
                  element.isComparing ? '#ef4444' : // Red for comparing
                  element.isInRange ? '#60a5fa' : // Light blue for in range
                  '#3b82f6', // Default blue
              }}
              transition={{ duration: 0.3 }}
              className="relative"
            >
              <div className="w-16 h-16 flex flex-col items-center justify-center text-white rounded-lg shadow-md">
                <span className="text-lg font-bold">{element.value}</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                [{idx}]
              </div>
              {element.isMid && (
                <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs text-orange-600 dark:text-orange-400 font-semibold">
                  MID
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className={`mb-4 p-4 rounded-lg ${
        steps[currentStepIndex]?.found === true ? 'bg-green-50 dark:bg-green-900/20' :
        steps[currentStepIndex]?.found === false ? 'bg-red-50 dark:bg-red-900/20' :
        'bg-blue-50 dark:bg-gray-700'
      }`}>
        <p className={`text-sm font-medium ${
          steps[currentStepIndex]?.found === true ? 'text-green-700 dark:text-green-300' :
          steps[currentStepIndex]?.found === false ? 'text-red-700 dark:text-red-300' :
          'text-gray-700 dark:text-gray-300'
        }`}>
          {currentDescription}
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Search Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Search Configuration</h3>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Algorithm:</label>
            <select
              value={algorithm}
              onChange={(e) => setAlgorithm(e.target.value as 'linear' | 'binary')}
              className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:text-white"
            >
              <option value="linear">Linear Search - O(n)</option>
              <option value="binary">Binary Search - O(log n)</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Target Value:</label>
            <input
              type="number"
              value={targetValue}
              onChange={(e) => setTargetValue(e.target.value)}
              placeholder="Enter target"
              className="w-full px-3 py-2 border rounded dark:bg-gray-600 dark:text-white dark:border-gray-500"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>

          <button
            onClick={handleSearch}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <Search className="inline h-4 w-4 mr-2" /> Start Search
          </button>
        </div>

        {/* Array Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Array Configuration</h3>
          
          <div className="mb-3">
            <label className="block text-sm text-gray-700 dark:text-gray-300 mb-1">Array Size: {arraySize}</label>
            <input
              type="range"
              min="5"
              max="20"
              value={arraySize}
              onChange={(e) => setArraySize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={generateSortedArray}
              className="flex-1 px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
            >
              Sorted Array
            </button>
            <button
              onClick={generateRandomArray}
              className="flex-1 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
            >
              <Shuffle className="inline h-4 w-4 mr-1" /> Random
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-600 dark:text-gray-400">
            {algorithm === 'binary' && '⚠️ Binary search requires a sorted array'}
          </div>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0 || steps.length === 0}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            disabled={steps.length === 0}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1 || steps.length === 0}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <SkipForward className="h-5 w-5" />
          </button>
          <button 
            onClick={handleReset} 
            disabled={steps.length === 0}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <RotateCcw className="h-5 w-5" />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-gray-300">Speed:</span>
          <select
            value={speed}
            onChange={(e) => setSpeed(Number(e.target.value))}
            className="px-3 py-1 border rounded dark:bg-gray-600 dark:text-white"
          >
            <option value={1500}>0.5x</option>
            <option value={800}>1x</option>
            <option value={400}>2x</option>
            <option value={200}>4x</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          {steps.length > 0 ? `Step ${currentStepIndex + 1} / ${steps.length}` : 'Ready'}
        </div>
      </div>

      {/* Comparison Table */}
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-3 text-gray-800 dark:text-white">Algorithm Comparison</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b dark:border-gray-600">
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Algorithm</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Time Complexity</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Space</th>
                <th className="text-left py-2 text-gray-700 dark:text-gray-300">Requirement</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 dark:text-gray-400">
              <tr className="border-b dark:border-gray-600">
                <td className="py-2">Linear Search</td>
                <td className="py-2">O(n)</td>
                <td className="py-2">O(1)</td>
                <td className="py-2">None</td>
              </tr>
              <tr>
                <td className="py-2">Binary Search</td>
                <td className="py-2">O(log n)</td>
                <td className="py-2">O(1)</td>
                <td className="py-2">Sorted array</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SearchingVisualizer;
