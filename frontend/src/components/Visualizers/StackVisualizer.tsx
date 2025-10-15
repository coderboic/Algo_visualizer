import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Plus, Minus } from 'lucide-react';

interface StackElement {
  value: number;
  id: number;
}

interface VisualizationStep {
  type: string;
  stack: number[];
  description: string;
  highlightedIndex?: number;
}

const StackVisualizer: React.FC = () => {
  const [stack, setStack] = useState<StackElement[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('');
  const [maxSize] = useState(10);

  // Initialize empty stack
  useEffect(() => {
    setSteps([{
      type: 'init',
      stack: [],
      description: 'Empty stack initialized (LIFO - Last In First Out)'
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
      const updatedStack = step.stack.map((val, idx) => ({
        value: val,
        id: idx
      }));
      setStack(updatedStack);
    }
  }, [currentStepIndex, steps]);

  const handlePush = () => {
    if (!inputValue) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentStack = [...steps[currentStepIndex].stack];

    if (currentStack.length >= maxSize) {
      newSteps.push({
        type: 'overflow',
        stack: currentStack,
        description: `Stack Overflow! Cannot push ${value}. Maximum size (${maxSize}) reached.`
      });
    } else {
      currentStack.push(value);
      newSteps.push({
        type: 'push',
        stack: currentStack,
        description: `Pushed ${value} onto the stack. New size: ${currentStack.length}`,
        highlightedIndex: currentStack.length - 1
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue('');
  };

  const handlePop = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentStack = [...steps[currentStepIndex].stack];

    if (currentStack.length === 0) {
      newSteps.push({
        type: 'underflow',
        stack: currentStack,
        description: 'Stack Underflow! Cannot pop from an empty stack.'
      });
    } else {
      const poppedValue = currentStack.pop()!;
      newSteps.push({
        type: 'pop',
        stack: currentStack,
        description: `Popped ${poppedValue} from the stack. New size: ${currentStack.length}`
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handlePeek = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentStack = [...steps[currentStepIndex].stack];

    if (currentStack.length === 0) {
      newSteps.push({
        type: 'peek-empty',
        stack: currentStack,
        description: 'Cannot peek: stack is empty'
      });
    } else {
      const topValue = currentStack[currentStack.length - 1];
      newSteps.push({
        type: 'peek',
        stack: currentStack,
        description: `Top element is: ${topValue}`,
        highlightedIndex: currentStack.length - 1
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const currentDescription = steps[currentStepIndex]?.description || '';
  const isOverflow = steps[currentStepIndex]?.type === 'overflow';
  const isUnderflow = steps[currentStepIndex]?.type === 'underflow';

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Stack Visualization</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Stack follows LIFO (Last In First Out) principle. Elements are added and removed from the top.
        </p>
      </div>

      {/* Stack Display */}
      <div className="flex-1 flex items-end justify-center mb-6 relative">
        <div className="relative">
          {/* Stack Container */}
          <div className="flex flex-col-reverse items-center gap-1 min-h-[400px] justify-start">
            <AnimatePresence>
              {stack.map((element, idx) => (
                <motion.div
                  key={element.id}
                  initial={{ y: -50, opacity: 0 }}
                  animate={{ 
                    y: 0, 
                    opacity: 1,
                    scale: steps[currentStepIndex]?.highlightedIndex === idx ? 1.1 : 1,
                    backgroundColor: steps[currentStepIndex]?.highlightedIndex === idx ? '#10b981' : '#3b82f6'
                  }}
                  exit={{ y: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-40 h-14 flex items-center justify-center bg-blue-500 text-white rounded-lg shadow-md border-2 border-blue-600"
                >
                  <span className="text-xl font-bold">{element.value}</span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Top Pointer */}
          {stack.length > 0 && (
            <div className="absolute -right-20 top-0 flex items-center">
              <div className="w-12 h-0.5 bg-red-500"></div>
              <div className="ml-2 text-red-500 font-semibold">TOP</div>
            </div>
          )}

          {/* Base */}
          <div className="w-48 h-2 bg-gray-400 dark:bg-gray-600 mt-2 rounded"></div>
          <div className="text-center text-gray-600 dark:text-gray-400 mt-1 text-sm">Base</div>
        </div>

        {/* Stack Info */}
        <div className="absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <div className="text-sm space-y-2">
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Size:</span> {stack.length}/{maxSize}
            </div>
            <div className="text-gray-700 dark:text-gray-300">
              <span className="font-semibold">Status:</span>{' '}
              {stack.length === 0 ? 'Empty' : stack.length === maxSize ? 'Full' : 'Active'}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className={`mb-4 p-4 rounded-lg ${isOverflow || isUnderflow ? 'bg-red-50 dark:bg-red-900/20' : 'bg-blue-50 dark:bg-gray-700'}`}>
        <p className={`text-sm ${isOverflow || isUnderflow ? 'text-red-700 dark:text-red-300 font-semibold' : 'text-gray-700 dark:text-gray-300'}`}>
          {currentDescription}
        </p>
      </div>

      {/* Operation Controls */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        {/* Push */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Push (Add)</h3>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handlePush()}
          />
          <button
            onClick={handlePush}
            disabled={stack.length >= maxSize}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Plus className="inline h-4 w-4 mr-1" /> Push
          </button>
        </div>

        {/* Pop */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Pop (Remove)</h3>
          <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm h-10 flex items-center">
            Removes top element
          </div>
          <button
            onClick={handlePop}
            disabled={stack.length === 0}
            className="w-full px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Minus className="inline h-4 w-4 mr-1" /> Pop
          </button>
        </div>

        {/* Peek */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Peek (View Top)</h3>
          <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm h-10 flex items-center">
            View top without removing
          </div>
          <button
            onClick={handlePeek}
            disabled={stack.length === 0}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            👁️ Peek
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
          <li>• Push: O(1) - Add element to top</li>
          <li>• Pop: O(1) - Remove element from top</li>
          <li>• Peek: O(1) - View top element</li>
          <li>• Search: O(n) - Must traverse stack</li>
        </ul>
      </div>
    </div>
  );
};

export default StackVisualizer;
