import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, SkipForward, SkipBack } from 'lucide-react';

interface GraphNode {
  id: string;
  x: number;
  y: number;
  label?: string;
  visited?: boolean;
  distance?: number | null;
  parent?: string | null;
  inQueue?: boolean;
  processing?: boolean;
}

interface GraphEdge {
  source: string;
  target: string;
  weight?: number;
  highlighted?: boolean;
  selected?: boolean;
}

interface GraphVisualizationStep {
  type: string;
  nodes: GraphNode[];
  edges: GraphEdge[];
  currentNode?: string;
  queue?: string[];
  stack?: string[];
  distances?: Record<string, number | null>;
  path?: string[];
  visited?: string[];
  description: string;
}

interface ComprehensiveGraphVisualizerProps {
  algorithmId: string;
  initialGraph?: { nodes: GraphNode[]; edges: GraphEdge[] };
  onComplete?: () => void;
}

export const ComprehensiveGraphVisualizer: React.FC<ComprehensiveGraphVisualizerProps> = ({
  algorithmId,
  initialGraph,
  onComplete
}) => {
  const [nodes, setNodes] = useState<GraphNode[]>([]);
  const [edges, setEdges] = useState<GraphEdge[]>([]);
  const [steps, setSteps] = useState<GraphVisualizationStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1000); // milliseconds
  const [startNode, setStartNode] = useState<string>('');
  const [endNode, setEndNode] = useState<string>('');
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate a sample graph
  const generateSampleGraph = () => {
    const sampleNodes: GraphNode[] = [
      { id: 'A', x: 150, y: 100, label: 'A' },
      { id: 'B', x: 350, y: 100, label: 'B' },
      { id: 'C', x: 100, y: 250, label: 'C' },
      { id: 'D', x: 250, y: 250, label: 'D' },
      { id: 'E', x: 400, y: 250, label: 'E' },
      { id: 'F', x: 250, y: 400, label: 'F' }
    ];

    const sampleEdges: GraphEdge[] = [
      { source: 'A', target: 'B', weight: 4 },
      { source: 'A', target: 'C', weight: 2 },
      { source: 'B', target: 'D', weight: 5 },
      { source: 'B', target: 'E', weight: 10 },
      { source: 'C', target: 'D', weight: 3 },
      { source: 'C', target: 'F', weight: 8 },
      { source: 'D', target: 'E', weight: 2 },
      { source: 'D', target: 'F', weight: 6 },
      { source: 'E', target: 'F', weight: 1 }
    ];

    setNodes(sampleNodes);
    setEdges(sampleEdges);
    setStartNode('A');
    setEndNode('F');
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Execute graph algorithm
  const executeAlgorithm = async () => {
    if (!startNode) {
      alert('Please select a start node');
      return;
    }

    try {
      // Send nodes and edges directly to backend
      const response = await fetch('http://localhost:5000/api/execute/algorithm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          algorithmId,
          input: {
            nodes,
            edges,
            startNode,
            endNode: algorithmId.includes('dijkstra') ? endNode : undefined
          }
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
    if (!initialGraph) {
      generateSampleGraph();
    } else {
      setNodes(initialGraph.nodes);
      setEdges(initialGraph.edges);
    }
  }, []);

  // Draw graph on canvas
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const currentStepData = steps[currentStep];
    
    // Use nodes and edges from step data if available, otherwise use initial state
    const displayNodes = currentStepData?.nodes || nodes;
    const displayEdges = currentStepData?.edges || edges;

    // Draw edges
    displayEdges.forEach(edge => {
      const fromNode = displayNodes.find(n => n.id === edge.source);
      const toNode = displayNodes.find(n => n.id === edge.target);
      if (!fromNode || !toNode) return;

      const isHighlighted = edge.highlighted;

      ctx.beginPath();
      ctx.moveTo(fromNode.x, fromNode.y);
      ctx.lineTo(toNode.x, toNode.y);
      ctx.strokeStyle = isHighlighted ? '#ef4444' : '#6b7280';
      ctx.lineWidth = isHighlighted ? 4 : 2;
      ctx.stroke();

      // Draw weight
      if (edge.weight) {
        const midX = (fromNode.x + toNode.x) / 2;
        const midY = (fromNode.y + toNode.y) / 2;
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(midX - 15, midY - 12, 30, 24);
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(edge.weight.toString(), midX, midY);
      }
    });

    // Draw nodes
    displayNodes.forEach(node => {
      const isCurrent = node.processing || currentStepData?.currentNode === node.id;
      const inPath = currentStepData?.path?.includes(node.id);
      const isVisited = node.visited;

      // Node circle
      ctx.beginPath();
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI);
      
      if (isCurrent) {
        ctx.fillStyle = '#ef4444'; // Red for current
      } else if (inPath) {
        ctx.fillStyle = '#10b981'; // Green for path
      } else if (isVisited) {
        ctx.fillStyle = '#3b82f6'; // Blue for visited
      } else {
        ctx.fillStyle = '#6b7280'; // Gray for unvisited
      }
      
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Node label
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(node.label || node.id, node.x, node.y);

      // Distance label for Dijkstra
      if (algorithmId.includes('dijkstra') && node.distance !== undefined) {
        ctx.fillStyle = '#000000';
        ctx.font = '12px Arial';
        ctx.fillText(
          node.distance === null || node.distance === Infinity ? '∞' : node.distance.toString(),
          node.x,
          node.y - 40
        );
      }
    });
  }, [nodes, edges, currentStep, steps, algorithmId]);

  const currentStepData = steps[currentStep];

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

      {/* Graph Canvas */}
      <div className="flex-1 bg-gray-800 rounded-lg mb-6 flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={500}
          height={500}
          className="border border-gray-700 rounded"
        />
      </div>

      {/* Description */}
      <div className="bg-gray-800 p-4 rounded-lg mb-6 min-h-[80px]">
        <p className="text-sm mb-2">
          {currentStepData?.description || 'Click "Start" to begin visualization'}
        </p>
        
        {currentStepData && (
          <div className="flex flex-wrap gap-4 text-xs mt-2">
            {currentStepData.queue && currentStepData.queue.length > 0 && (
              <div>
                <span className="font-semibold">Queue:</span> [{currentStepData.queue.join(', ')}]
              </div>
            )}
            {currentStepData.stack && currentStepData.stack.length > 0 && (
              <div>
                <span className="font-semibold">Stack:</span> [{currentStepData.stack.join(', ')}]
              </div>
            )}
            {currentStepData.visited && currentStepData.visited.length > 0 && (
              <div>
                <span className="font-semibold">Visited:</span> [{currentStepData.visited.join(', ')}]
              </div>
            )}
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Input Controls */}
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <label className="block text-xs font-medium mb-1">Start Node</label>
            <select
              value={startNode}
              onChange={(e) => setStartNode(e.target.value)}
              className="w-full px-3 py-2 bg-gray-700 rounded text-white"
              disabled={isPlaying || steps.length > 0}
            >
              <option value="">Select...</option>
              {nodes.map(node => (
                <option key={node.id} value={node.id}>{node.label || node.id}</option>
              ))}
            </select>
          </div>
          
          {algorithmId.includes('dijkstra') && (
            <div className="flex-1">
              <label className="block text-xs font-medium mb-1">End Node</label>
              <select
                value={endNode}
                onChange={(e) => setEndNode(e.target.value)}
                className="w-full px-3 py-2 bg-gray-700 rounded text-white"
                disabled={isPlaying || steps.length > 0}
              >
                <option value="">Select...</option>
                {nodes.map(node => (
                  <option key={node.id} value={node.id}>{node.label || node.id}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-end gap-2">
          <button
            onClick={executeAlgorithm}
            disabled={isPlaying || !startNode}
            className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-500 disabled:bg-gray-800 disabled:opacity-50 rounded transition font-semibold"
          >
            Start
          </button>

          <button
            onClick={generateSampleGraph}
            disabled={isPlaying}
            className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-800 disabled:opacity-50 rounded transition font-semibold"
          >
            New Graph
          </button>
        </div>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center gap-2 mb-6">
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

        {/* Speed Control */}
        <div className="flex-1 ml-4">
          <label className="block text-xs font-medium mb-1">
            Speed: {2000 - speed}ms
          </label>
          <input
            type="range"
            min="200"
            max="1800"
            value={2000 - speed}
            onChange={(e) => setSpeed(2000 - parseInt(e.target.value))}
            className="w-full"
          />
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-gray-600 rounded-full border-2 border-white"></div>
          <span>Unvisited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white"></div>
          <span>Visited</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded-full border-2 border-white"></div>
          <span>Current</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
          <span>Path</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-1 bg-red-500"></div>
          <span>Active Edge</span>
        </div>
      </div>
    </div>
  );
};

export default ComprehensiveGraphVisualizer;
