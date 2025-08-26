import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack, RefreshCw } from 'lucide-react';
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

interface GraphVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number) => void;
}

type Node = {
  id: string;
  x: number;
  y: number;
  color: string;
  label: string;
};

type Edge = {
  id: string;
  source: string;
  target: string;
  label: string;
  animated: boolean;
};

const CanvasGraphVisualizer: React.FC<GraphVisualizerProps> = ({ algorithm, onStepChange }) => {
  const dispatch = useAppDispatch();
  const visualization = useAppSelector((state) => state.visualization);
  const { steps, currentStepIndex, isPlaying } = visualization as any;
  
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a sample graph
  const generateRandomGraph = useCallback(() => {
    const numberOfNodes = Math.floor(Math.random() * 4) + 5; // 5-8 nodes
    const newNodes: Node[] = [];
    const newEdges: Edge[] = [];
    
    // Create nodes in a circular layout
    for (let i = 0; i < numberOfNodes; i++) {
      const angle = (i * 2 * Math.PI) / numberOfNodes;
      const radius = 150;
      const x = 250 + radius * Math.cos(angle);
      const y = 200 + radius * Math.sin(angle);
      
      newNodes.push({
        id: String.fromCharCode(65 + i), // A, B, C, ...
        x,
        y,
        color: '#3B82F6',
        label: String.fromCharCode(65 + i),
      });
    }
    
    // Create random edges (ensuring connectedness)
    // First ensure all nodes are connected
    for (let i = 1; i < numberOfNodes; i++) {
      const sourceId = String.fromCharCode(65 + (i - 1) % numberOfNodes);
      const targetId = String.fromCharCode(65 + i);
      const weight = Math.floor(Math.random() * 10) + 1; // 1-10 weight
      
      newEdges.push({
        id: `e${sourceId}-${targetId}`,
        source: sourceId,
        target: targetId,
        label: weight.toString(),
        animated: false,
      });
    }
    
    // Add a few random edges
    const maxExtraEdges = numberOfNodes;
    const extraEdges = Math.floor(Math.random() * maxExtraEdges) + 1;
    
    for (let i = 0; i < extraEdges; i++) {
      const sourceIdx = Math.floor(Math.random() * numberOfNodes);
      let targetIdx = Math.floor(Math.random() * numberOfNodes);
      
      // Avoid self-loops and duplicate edges
      while (targetIdx === sourceIdx) {
        targetIdx = Math.floor(Math.random() * numberOfNodes);
      }
      
      const sourceId = String.fromCharCode(65 + sourceIdx);
      const targetId = String.fromCharCode(65 + targetIdx);
      
      // Check if edge already exists
      const edgeExists = newEdges.some(
        e => (e.source === sourceId && e.target === targetId) ||
             (e.source === targetId && e.target === sourceId)
      );
      
      if (!edgeExists) {
        const weight = Math.floor(Math.random() * 10) + 1; // 1-10 weight
        
        newEdges.push({
          id: `e${sourceId}-${targetId}`,
          source: sourceId,
          target: targetId,
          label: weight.toString(),
          animated: false,
        });
      }
    }
    
    setNodes(newNodes);
    setEdges(newEdges);
    
    // Create input data structure for algorithm
    const graphData = {
      nodes: newNodes.map(n => n.id),
      edges: newEdges.map(e => ({
        from: e.source,
        to: e.target,
        weight: parseInt(e.label),
      })),
      startNode: newNodes[0].id,
    };
    
    // Convert to array for Redux action if needed
    dispatch(setInputData([graphData] as any));
    dispatch(reset());
  }, [dispatch]);

  // Initialize graph on mount
  useEffect(() => {
    generateRandomGraph();
  }, [generateRandomGraph]);

  // Draw graph whenever nodes or edges change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw edges
    edges.forEach(edge => {
      const source = nodes.find(n => n.id === edge.source);
      const target = nodes.find(n => n.id === edge.target);
      
      if (source && target) {
        ctx.beginPath();
        ctx.moveTo(source.x, source.y);
        ctx.lineTo(target.x, target.y);
        ctx.strokeStyle = edge.animated ? '#8B5CF6' : '#94A3B8';
        ctx.lineWidth = edge.animated ? 3 : 1;
        ctx.stroke();
        
        // Draw edge label (weight)
        const labelX = (source.x + target.x) / 2;
        const labelY = (source.y + target.y) / 2;
        ctx.fillStyle = '#4B5563';
        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.label, labelX, labelY);
      }
    });
    
    // Draw nodes
    nodes.forEach(node => {
      ctx.beginPath();
      ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI);
      ctx.fillStyle = node.color;
      ctx.fill();
      ctx.strokeStyle = '#2563EB';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // Draw node label
      ctx.fillStyle = '#FFFFFF';
      ctx.font = 'bold 14px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label, node.x, node.y);
    });
  }, [nodes, edges]);

  // Handle play/pause animation
  useEffect(() => {
    if (isPlaying && steps && steps.length > 0) {
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
  }, [isPlaying, currentStepIndex, steps, animationSpeed, dispatch]);

  // Update graph based on current step
  useEffect(() => {
    if (steps && steps.length > 0 && currentStepIndex >= 0 && steps[currentStepIndex]) {
      const currentStep = steps[currentStepIndex];
      
      // Update nodes
      const updatedNodes = nodes.map(node => {
        let color = '#3B82F6'; // default blue
        
        // Highlight current node
        if (node.id === currentStep.currentNode) {
          color = '#EF4444'; // Red for current node
        }
        
        // Highlight discovered node
        if (node.id === currentStep.discoveredNode) {
          color = '#F59E0B'; // Yellow for discovered
        }
        
        // Highlight visited nodes
        if (currentStep.visited?.includes(node.id)) {
          color = '#10B981'; // Green for visited
        }
        
        return {
          ...node,
          color,
        };
      });
      
      // Update edges
      const updatedEdges = edges.map(edge => {
        const isActive = currentStep.currentNode === edge.source && 
                         currentStep.discoveredNode === edge.target;
        
        return {
          ...edge,
          animated: isActive,
        };
      });
      
      setNodes(updatedNodes);
      setEdges(updatedEdges);
      onStepChange?.(currentStepIndex);
    }
  }, [currentStepIndex, steps, nodes, edges, onStepChange]);

  const handlePlayPause = () => {
    if (isPlaying) {
      dispatch(pause());
    } else {
      dispatch(play());
    }
  };

  const handleReset = () => {
    dispatch(reset());
    generateRandomGraph();
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

  return (
    <div className="w-full h-full flex flex-col bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      {/* Visualization Area */}
      <div className="flex-1 min-h-[400px] p-4">
        <canvas 
          ref={canvasRef} 
          width="500" 
          height="400" 
          className="w-full h-[400px] border border-gray-200 dark:border-gray-700 rounded-lg"
        />
      </div>

      {/* Controls */}
      <div className="p-6 space-y-4">
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
            disabled={!steps || currentStepIndex === 0}
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
            disabled={!steps || currentStepIndex >= (steps?.length || 0) - 1}
            title="Next Step"
          >
            <SkipForward className="h-5 w-5" />
          </button>

          <button
            onClick={generateRandomGraph}
            className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            title="Generate New Graph"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>

        {/* Speed Control */}
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

        {/* Step Information */}
        {steps && steps.length > 0 && currentStepIndex >= 0 && steps[currentStepIndex] && (
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
          </div>
        )}

        {/* Legend */}
        <div className="flex justify-center space-x-6 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Default</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Discovered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            <span className="text-gray-600 dark:text-gray-400">Visited</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CanvasGraphVisualizer;
