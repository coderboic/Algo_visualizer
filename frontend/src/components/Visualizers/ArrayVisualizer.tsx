import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Plus, Minus, Search } from 'lucide-react';

interface ArrayElement {
  value: number;
  index: number;
  isHighlighted?: boolean;
  isAccessed?: boolean;
  isInserted?: boolean;
  isDeleted?: boolean;
}

interface VisualizationStep {
  type: string;
  array: number[];
  description: string;
  highlightedIndices?: number[];
  accessedIndex?: number;
}

const ArrayVisualizer: React.FC = () => {
  const [array, setArray] = useState<ArrayElement[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('');
  const [searchValue, setSearchValue] = useState('');

  // Initialize array
  useEffect(() => {
    const initialArray = [10, 20, 30, 40, 50, 60, 70, 80];
    setArray(initialArray.map((val, idx) => ({ value: val, index: idx })));
    setSteps([{
      type: 'init',
      array: initialArray,
      description: 'Array initialized with 8 elements'
    }]);
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
        isHighlighted: step.highlightedIndices?.includes(idx),
        isAccessed: step.accessedIndex === idx,
      }));
      setArray(updatedArray);
    }
  }, [currentStepIndex, steps]);

  const handleInsert = (position: 'start' | 'end' | 'middle') => {
    if (!inputValue) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentArray = [...steps[currentStepIndex].array];
    
    let insertIndex: number;
    let description: string;

    switch (position) {
      case 'start':
        insertIndex = 0;
        currentArray.unshift(value);
        description = `Inserted ${value} at the beginning (index 0)`;
        break;
      case 'end':
        insertIndex = currentArray.length;
        currentArray.push(value);
        description = `Inserted ${value} at the end (index ${insertIndex})`;
        break;
      case 'middle':
        insertIndex = Math.floor(currentArray.length / 2);
        currentArray.splice(insertIndex, 0, value);
        description = `Inserted ${value} at index ${insertIndex}`;
        break;
    }

    newSteps.push({
      type: 'insert',
      array: currentArray,
      description,
      highlightedIndices: [insertIndex]
    });

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue('');
  };

  const handleDelete = (position: 'start' | 'end' | 'middle') => {
    const currentArray = [...steps[currentStepIndex].array];
    if (currentArray.length === 0) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    let deleteIndex: number;
    let deletedValue: number;
    let description: string;

    switch (position) {
      case 'start':
        deleteIndex = 0;
        deletedValue = currentArray.shift()!;
        description = `Deleted ${deletedValue} from the beginning`;
        break;
      case 'end':
        deleteIndex = currentArray.length - 1;
        deletedValue = currentArray.pop()!;
        description = `Deleted ${deletedValue} from the end`;
        break;
      case 'middle':
        deleteIndex = Math.floor(currentArray.length / 2);
        deletedValue = currentArray.splice(deleteIndex, 1)[0];
        description = `Deleted ${deletedValue} from index ${deleteIndex}`;
        break;
    }

    newSteps.push({
      type: 'delete',
      array: currentArray,
      description,
      highlightedIndices: []
    });

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handleSearch = () => {
    if (!searchValue) return;
    const target = parseInt(searchValue);
    if (isNaN(target)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentArray = [...steps[currentStepIndex].array];

    newSteps.push({
      type: 'search-start',
      array: currentArray,
      description: `Searching for ${target}...`
    });

    for (let i = 0; i < currentArray.length; i++) {
      newSteps.push({
        type: 'search-compare',
        array: currentArray,
        description: `Checking index ${i}: ${currentArray[i]}`,
        accessedIndex: i
      });

      if (currentArray[i] === target) {
        newSteps.push({
          type: 'search-found',
          array: currentArray,
          description: `Found ${target} at index ${i}!`,
          highlightedIndices: [i]
        });
        setSteps(newSteps);
        setCurrentStepIndex(newSteps.length - 1);
        setSearchValue('');
        return;
      }
    }

    newSteps.push({
      type: 'search-not-found',
      array: currentArray,
      description: `${target} not found in array`
    });

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setSearchValue('');
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentDescription = steps[currentStepIndex]?.description || '';

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Array Visualization</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Arrays are contiguous blocks of memory storing elements of the same type with O(1) access time.
        </p>
      </div>

      {/* Array Display */}
      <div className="flex-1 flex items-center justify-center mb-6 overflow-x-auto">
        <div className="flex gap-2">
          {array.map((element, idx) => (
            <motion.div
              key={idx}
              initial={{ scale: 0 }}
              animate={{ 
                scale: element.isHighlighted || element.isAccessed ? 1.1 : 1,
                backgroundColor: element.isHighlighted ? '#10b981' : element.isAccessed ? '#f59e0b' : '#3b82f6'
              }}
              className="relative"
            >
              <div className="w-16 h-16 flex flex-col items-center justify-center bg-blue-500 text-white rounded-lg shadow-md">
                <span className="text-lg font-bold">{element.value}</span>
              </div>
              <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 dark:text-gray-400">
                [{idx}]
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">{currentDescription}</p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        {/* Insert Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Insert Element</h3>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
          />
          <div className="flex gap-2">
            <button onClick={() => handleInsert('start')} className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
              <Plus className="inline h-4 w-4" /> Start
            </button>
            <button onClick={() => handleInsert('middle')} className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
              <Plus className="inline h-4 w-4" /> Mid
            </button>
            <button onClick={() => handleInsert('end')} className="flex-1 px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm">
              <Plus className="inline h-4 w-4" /> End
            </button>
          </div>
        </div>

        {/* Delete Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Delete Element</h3>
          <div className="flex gap-2 mt-8">
            <button onClick={() => handleDelete('start')} className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              <Minus className="inline h-4 w-4" /> Start
            </button>
            <button onClick={() => handleDelete('middle')} className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              <Minus className="inline h-4 w-4" /> Mid
            </button>
            <button onClick={() => handleDelete('end')} className="flex-1 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm">
              <Minus className="inline h-4 w-4" /> End
            </button>
          </div>
        </div>

        {/* Search Controls */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Search Element</h3>
          <input
            type="number"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            placeholder="Search value"
            className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
          />
          <button onClick={handleSearch} className="w-full px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
            <Search className="inline h-4 w-4 mr-1" /> Search
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-between gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentStepIndex(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <SkipBack className="h-5 w-5" />
          </button>
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
          </button>
          <button
            onClick={() => setCurrentStepIndex(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
            className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
          >
            <SkipForward className="h-5 w-5" />
          </button>
          <button onClick={handleReset} className="p-2 bg-gray-200 dark:bg-gray-600 rounded hover:bg-gray-300">
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
            <option value={2000}>0.5x</option>
            <option value={1000}>1x</option>
            <option value={500}>2x</option>
            <option value={250}>4x</option>
          </select>
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-300">
          Step {currentStepIndex + 1} / {steps.length}
        </div>
      </div>

      {/* Complexity Info */}
      <div className="mt-4 p-4 bg-yellow-50 dark:bg-gray-700 rounded-lg">
        <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Time Complexity</h3>
        <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
          <li>• Access: O(1) - Direct index access</li>
          <li>• Search: O(n) - Linear search through elements</li>
          <li>• Insert: O(n) - May need to shift elements</li>
          <li>• Delete: O(n) - May need to shift elements</li>
        </ul>
      </div>
    </div>
  );
};

export default ArrayVisualizer;
