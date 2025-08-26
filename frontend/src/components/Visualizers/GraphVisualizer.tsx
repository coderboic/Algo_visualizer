import React from 'react';
import CanvasGraphVisualizer from './CanvasGraphVisualizer';

interface GraphVisualizerProps {
  algorithm: string;
  onStepChange?: (step: number) => void;
}

// This is a wrapper component that delegates to CanvasGraphVisualizer
const GraphVisualizer: React.FC<GraphVisualizerProps> = (props) => {
  return <CanvasGraphVisualizer {...props} />;
};

export default GraphVisualizer;
