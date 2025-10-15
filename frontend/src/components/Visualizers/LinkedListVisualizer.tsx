import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, Plus, Minus } from 'lucide-react';

interface ListNode {
  value: number;
  id: number;
  next: number | null;
}

interface VisualizationStep {
  type: string;
  nodes: ListNode[];
  description: string;
  highlightedNode?: number;
  highlightedPointer?: number;
}

const LinkedListVisualizer: React.FC = () => {
  const [nodes, setNodes] = useState<ListNode[]>([]);
  const [steps, setSteps] = useState<VisualizationStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000);
  const [inputValue, setInputValue] = useState('');
  let nextId = 0;

  // Initialize linked list
  useEffect(() => {
    const initialNodes: ListNode[] = [
      { value: 10, id: 0, next: 1 },
      { value: 20, id: 1, next: 2 },
      { value: 30, id: 2, next: 3 },
      { value: 40, id: 3, next: null }
    ];
    nextId = 4;
    setNodes(initialNodes);
    setSteps([{
      type: 'init',
      nodes: initialNodes,
      description: 'Linked list initialized with 4 nodes. Each node contains data and a pointer to the next node.'
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
      setNodes(step.nodes);
    }
  }, [currentStepIndex, steps]);

  const handleInsertAtHead = () => {
    if (!inputValue) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentNodes = [...steps[currentStepIndex].nodes];
    
    const newNode: ListNode = {
      value,
      id: nextId++,
      next: currentNodes.length > 0 ? currentNodes[0].id : null
    };

    currentNodes.unshift(newNode);

    newSteps.push({
      type: 'insert-head',
      nodes: currentNodes,
      description: `Inserted ${value} at the head. New head node points to the previous head.`,
      highlightedNode: 0
    });

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue('');
  };

  const handleInsertAtTail = () => {
    if (!inputValue) return;
    const value = parseInt(inputValue);
    if (isNaN(value)) return;

    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentNodes = [...steps[currentStepIndex].nodes];
    
    const newNode: ListNode = {
      value,
      id: nextId++,
      next: null
    };

    if (currentNodes.length > 0) {
      currentNodes[currentNodes.length - 1].next = newNode.id;
    }
    currentNodes.push(newNode);

    newSteps.push({
      type: 'insert-tail',
      nodes: currentNodes,
      description: `Inserted ${value} at the tail. Previous tail now points to new tail.`,
      highlightedNode: currentNodes.length - 1
    });

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
    setInputValue('');
  };

  const handleDeleteHead = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentNodes = [...steps[currentStepIndex].nodes];

    if (currentNodes.length === 0) {
      newSteps.push({
        type: 'delete-empty',
        nodes: currentNodes,
        description: 'Cannot delete: list is empty'
      });
    } else {
      const deletedValue = currentNodes[0].value;
      currentNodes.shift();

      newSteps.push({
        type: 'delete-head',
        nodes: currentNodes,
        description: `Deleted head node with value ${deletedValue}. Next node is now the head.`
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handleDeleteTail = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentNodes = [...steps[currentStepIndex].nodes];

    if (currentNodes.length === 0) {
      newSteps.push({
        type: 'delete-empty',
        nodes: currentNodes,
        description: 'Cannot delete: list is empty'
      });
    } else if (currentNodes.length === 1) {
      const deletedValue = currentNodes[0].value;
      currentNodes.pop();
      newSteps.push({
        type: 'delete-tail',
        nodes: currentNodes,
        description: `Deleted tail node with value ${deletedValue}. List is now empty.`
      });
    } else {
      const deletedValue = currentNodes[currentNodes.length - 1].value;
      currentNodes[currentNodes.length - 2].next = null;
      currentNodes.pop();

      newSteps.push({
        type: 'delete-tail',
        nodes: currentNodes,
        description: `Deleted tail node with value ${deletedValue}. Previous node is now the tail.`
      });
    }

    setSteps(newSteps);
    setCurrentStepIndex(newSteps.length - 1);
  };

  const handleTraverse = () => {
    const newSteps: VisualizationStep[] = [...steps.slice(0, currentStepIndex + 1)];
    const currentNodes = [...steps[currentStepIndex].nodes];

    if (currentNodes.length === 0) {
      newSteps.push({
        type: 'traverse-empty',
        nodes: currentNodes,
        description: 'Cannot traverse: list is empty'
      });
    } else {
      newSteps.push({
        type: 'traverse-start',
        nodes: currentNodes,
        description: 'Starting traversal from head...'
      });

      for (let i = 0; i < currentNodes.length; i++) {
        newSteps.push({
          type: 'traverse',
          nodes: currentNodes,
          description: `Visiting node ${i + 1}: value = ${currentNodes[i].value}`,
          highlightedNode: i,
          highlightedPointer: i < currentNodes.length - 1 ? i : undefined
        });
      }

      newSteps.push({
        type: 'traverse-end',
        nodes: currentNodes,
        description: 'Traversal complete. Reached end of list (null pointer).'
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
  const highlightedNode = steps[currentStepIndex]?.highlightedNode;
  const highlightedPointer = steps[currentStepIndex]?.highlightedPointer;

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Linked List Visualization</h2>
        <p className="text-gray-600 dark:text-gray-300">
          Linked List is a linear data structure where elements are stored in nodes, each containing data and a pointer to the next node.
        </p>
      </div>

      {/* Linked List Display */}
      <div className="flex-1 flex items-center justify-center mb-6 overflow-x-auto">
        <div className="flex items-center gap-4 p-6">
          {/* Head Label */}
          <div className="flex flex-col items-center">
            <div className="text-green-600 dark:text-green-400 font-semibold mb-2">HEAD</div>
            <div className="w-0 h-0 border-t-8 border-t-transparent border-b-8 border-b-transparent border-l-8 border-l-green-600"></div>
          </div>

          <AnimatePresence mode="popLayout">
            {nodes.map((node, idx) => (
              <React.Fragment key={node.id}>
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: highlightedNode === idx ? 1.1 : 1,
                    opacity: 1,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  className={`flex items-center ${highlightedNode === idx ? 'z-10' : ''}`}
                >
                  {/* Node */}
                  <div className={`
                    w-24 h-20 flex items-center border-2 rounded-lg transition-all
                    ${highlightedNode === idx 
                      ? 'bg-green-500 border-green-600 shadow-lg' 
                      : 'bg-blue-500 border-blue-600'
                    }
                  `}>
                    <div className="flex-1 flex flex-col items-center justify-center border-r-2 border-blue-600 text-white">
                      <span className="text-xs">Data</span>
                      <span className="text-lg font-bold">{node.value}</span>
                    </div>
                    <div className="w-10 flex items-center justify-center text-white">
                      <span className="text-2xl">→</span>
                    </div>
                  </div>
                </motion.div>

                {/* Pointer Arrow */}
                {node.next !== null && (
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: 40 }}
                    className={`h-1 ${highlightedPointer === idx ? 'bg-yellow-500' : 'bg-gray-400'} transition-colors`}
                  ></motion.div>
                )}
              </React.Fragment>
            ))}
          </AnimatePresence>

          {/* Null pointer */}
          {nodes.length > 0 && (
            <div className="flex flex-col items-center">
              <div className="text-red-600 dark:text-red-400 font-semibold text-xl">NULL</div>
            </div>
          )}

          {nodes.length === 0 && (
            <div className="text-gray-400 dark:text-gray-500 py-8">List is empty</div>
          )}
        </div>
      </div>

      {/* Description */}
      <div className="mb-4 p-4 bg-blue-50 dark:bg-gray-700 rounded-lg">
        <p className="text-sm text-gray-700 dark:text-gray-300">{currentDescription}</p>
      </div>

      {/* Operation Controls */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
        {/* Insert at Head */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white text-sm">Insert at Head</h3>
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value"
            className="w-full px-3 py-2 border rounded mb-2 dark:bg-gray-600 dark:text-white dark:border-gray-500 text-sm"
          />
          <button
            onClick={handleInsertAtHead}
            className="w-full px-3 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
            <Plus className="inline h-4 w-4" /> Head
          </button>
        </div>

        {/* Insert at Tail */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white text-sm">Insert at Tail</h3>
          <div className="mb-2 h-10"></div>
          <button
            onClick={handleInsertAtTail}
            className="w-full px-3 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
          >
            <Plus className="inline h-4 w-4" /> Tail
          </button>
        </div>

        {/* Delete Head */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white text-sm">Delete Head</h3>
          <div className="mb-2 h-10"></div>
          <button
            onClick={handleDeleteHead}
            disabled={nodes.length === 0}
            className="w-full px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 text-sm"
          >
            <Minus className="inline h-4 w-4" /> Head
          </button>
        </div>

        {/* Delete Tail */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white text-sm">Delete Tail</h3>
          <div className="mb-2 h-10"></div>
          <button
            onClick={handleDeleteTail}
            disabled={nodes.length === 0}
            className="w-full px-3 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50 text-sm"
          >
            <Minus className="inline h-4 w-4" /> Tail
          </button>
        </div>

        {/* Traverse */}
        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
          <h3 className="font-semibold mb-2 text-gray-800 dark:text-white text-sm">Traverse List</h3>
          <div className="mb-2 h-10"></div>
          <button
            onClick={handleTraverse}
            disabled={nodes.length === 0}
            className="w-full px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 text-sm"
          >
            ➡️ Traverse
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
          <li>• Insert at Head: O(1) - Direct insertion</li>
          <li>• Insert at Tail: O(n) - Must traverse to end (O(1) with tail pointer)</li>
          <li>• Delete at Head: O(1) - Direct deletion</li>
          <li>• Delete at Tail: O(n) - Must traverse to find second-to-last node</li>
          <li>• Search: O(n) - Must traverse list</li>
        </ul>
      </div>
    </div>
  );
};

export default LinkedListVisualizer;
