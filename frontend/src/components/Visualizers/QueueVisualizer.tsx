import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Plus, Minus } from 'lucide-react';

interface QueueElement {
  value: number;
  id: number;
}

interface VisualizationStep {
  type: string;
  queue: number[];
  description: string;
  highlightedType?: 'enqueue' | 'dequeue' | 'front' | 'rear';
}

const QueueVisualizer: React.FC = () => {
  const [queue, setQueue] = useState<QueueElement[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('');
  const [maxSize] = useState(8);

  // Initialize empty queue
  useEffect(() => {
    setSteps([{
      type: 'init',
      queue: [],
      description: 'Empty queue initialized (FIFO - First In First Out)'
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
      const updatedQueue = step.queue.map((val, idx) => ({
        value: val,
        id: idx
      }));
      setQueue(updatedQueue);
    }
  }, [currentStepIndex, steps]);

  const handleEnqueue = () => {
    if (!inputValue) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentQueue = [...steps[currentStepIndex].queue];

    if (currentQueue.length >= maxSize) {
      newSteps.push({
        type: 'overflow',
        queue: currentQueue,
        description: `Queue Overflow! Cannot enqueue ${value}. Maximum size (${maxSize}) reached.`
      });
    } else {
      currentQueue.push(value);
      newSteps.push({
        type: 'enqueue',
        queue: currentQueue,
        description: `Enqueued ${value} at the rear. Queue size: ${currentQueue.length}`,
        highlightedType: 'enqueue'
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue('');
  };

  const handleDequeue = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentQueue = [...steps[currentStepIndex].queue];

    if (currentQueue.length === 0) {
      newSteps.push({
        type: 'underflow',
        queue: currentQueue,
        description: 'Queue Underflow! Cannot dequeue from an empty queue.'
      });
    } else {
      const dequeuedValue = currentQueue.shift()!;
      newSteps.push({
        type: 'dequeue',
        queue: currentQueue,
        description: `Dequeued ${dequeuedValue} from the front. Queue size: ${currentQueue.length}`,
        highlightedType: 'dequeue'
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handlePeekFront = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentQueue = [...steps[currentStepIndex].queue];

    if (currentQueue.length === 0) {
      newSteps.push({
        type: 'peek-empty',
        queue: currentQueue,
        description: 'Cannot peek: queue is empty'
      });
    } else {
      const frontValue = currentQueue[0];
      newSteps.push({
        type: 'peek-front',
        queue: currentQueue,
        description: `Front element is: ${frontValue}`,
        highlightedType: 'front'
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handlePeekRear = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentQueue = [...steps[currentStepIndex].queue];

    if (currentQueue.length === 0) {
      newSteps.push({
        type: 'peek-empty',
        queue: currentQueue,
        description: 'Cannot peek: queue is empty'
      });
    } else {
      const rearValue = currentQueue[currentQueue.length - 1];
      newSteps.push({
        type: 'peek-rear',
        queue: currentQueue,
        description: `Rear element is: ${rearValue}`,
        highlightedType: 'rear'
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
  const currentHighlight = steps[currentStepIndex]?.highlightedType;
  const isOverflow = steps[currentStepIndex]?.type === 'overflow';
  const isUnderflow = steps[currentStepIndex]?.type === 'underflow';

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Queue Visualization</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Queue follows FIFO (First In First Out) principle. Elements are added at rear and removed from front.
        </p>
      </div>

      {/* Queue Display */}
      <div className="flex-1 flex items-center justify-center mb-6 relative">
        <div className="relative flex flex-col items-center">
          {/* Front/Rear Labels */}
          <div className="flex justify-between w-full mb-2 px-4">
            <div className="text-green-600 dark:text-green-400 font-semibold flex items-center">
              <span className="mr-2">↓</span> FRONT (Dequeue)
            </div>
            <div className="text-blue-600 dark:text-blue-400 font-semibold flex items-center">
              REAR (Enqueue) <span className="ml-2">↓</span>
            </div>
          </div>

          {/* Queue Container */}
          <div className="flex gap-2 min-w-[600px] justify-center items-center p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg">
            <AnimatePresence mode="popLayout">
              {queue.map((element, idx) => (
                <motion.div
                  key={element.id}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ 
                    x: 0, 
                    opacity: 1,
                    scale: (currentHighlight === 'front' && idx === 0) || 
                           (currentHighlight === 'rear' && idx === queue.length - 1) ? 1.1 : 1,
                    backgroundColor: 
                      (currentHighlight === 'front' && idx === 0) ? '#10b981' :
                      (currentHighlight === 'rear' && idx === queue.length - 1) ? '#3b82f6' :
                      '#6b7280'
                  }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-20 h-20 flex items-center justify-center bg-gray-500 text-white rounded-lg shadow-md relative"
                >
                  <span className="text-xl font-bold">{element.value}</span>
                  {idx === 0 && (
                    <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-green-600 dark:text-green-400 text-xs font-semibold">
                      Front
                    </div>
                  )}
                  {idx === queue.length - 1 && (
                    <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-blue-600 dark:text-blue-400 text-xs font-semibold">
                      Rear
                    </div>
                  )}
                </motion.div>
              ))}
              {queue.length === 0 && (
                <div className="text-gray-400 dark:text-gray-500 py-8">Queue is empty</div>
              )}
            </AnimatePresence>
          </div>

          {/* Queue Info */}
          <div className="mt-4 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
            <div className="text-sm space-y-2">
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Size:</span> {queue.length}/{maxSize}
              </div>
              <div className="text-gray-700 dark:text-gray-300">
                <span className="font-semibold">Status:</span>{' '}
                {queue.length === 0 ? 'Empty' : queue.length === maxSize ? 'Full' : 'Active'}
              </div>
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
      <div className="grid grid-cols-4 gap-4 mb-4">
        {/* Enqueue */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Enqueue</h3>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500"
            onKeyPress={(e) => e.key === 'Enter' && handleEnqueue()}
          />
          <button
            onClick={handleEnqueue}
            disabled={queue.length >= maxSize}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Plus className="inline h-4 w-4 mr-1" /> Add to Rear
          </button>
        </div>

        {/* Dequeue */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Dequeue</h3>
          <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm h-10 flex items-center">
            Remove from front
          </div>
          <button
            onClick={handleDequeue}
            disabled={queue.length === 0}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            <Minus className="inline h-4 w-4 mr-1" /> Remove Front
          </button>
        </div>

        {/* Peek Front */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Peek Front</h3>
          <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm h-10 flex items-center">
            View front element
          </div>
          <button
            onClick={handlePeekFront}
            disabled={queue.length === 0}
            className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            👁️ Front
          </button>
        </div>

        {/* Peek Rear */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white">Peek Rear</h3>
          <div className="mb-2 text-gray-600 dark:text-gray-400 text-sm h-10 flex items-center">
            View rear element
          </div>
          <button
            onClick={handlePeekRear}
            disabled={queue.length === 0}
            className="w-full px-4 py-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
          >
            👁️ Rear
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
          <li>• Enqueue: O(1) - Add element to rear</li>
          <li>• Dequeue: O(1) - Remove element from front</li>
          <li>• Peek: O(1) - View front/rear element</li>
          <li>• Search: O(n) - Must traverse queue</li>
        </ul>
      </div>
    </div>
  );
};

export default QueueVisualizer;
