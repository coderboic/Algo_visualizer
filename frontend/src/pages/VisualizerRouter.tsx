import React from 'react';
import { useParams } from 'react-router-dom';
import SimpleVisualizerPage from './SimpleVisualizerPage';
import ComprehensiveSortingVisualizer from '../components/Visualizers/ComprehensiveSortingVisualizer';
import ComprehensiveGraphVisualizer from '../components/Visualizers/ComprehensiveGraphVisualizer';
import { getAllAlgorithms } from '../data/algorithms';

const VisualizerRouter: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  
  if (!algorithmId) {
    return <div>Algorithm not found</div>;
  }

  // Get algorithm details
  const allAlgorithms = getAllAlgorithms();
  const algorithm = allAlgorithms.find(alg => alg.id === algorithmId);

  if (!algorithm) {
    return <div>Algorithm not found</div>;
  }

  // Sorting algorithms - use ComprehensiveSortingVisualizer
  const sortingAlgorithms = ['bubble-sort', 'selection-sort', 'insertion-sort', 'merge-sort', 'quick-sort', 'heap-sort'];
  if (sortingAlgorithms.includes(algorithmId)) {
    return <ComprehensiveSortingVisualizer algorithmId={algorithmId} />;
  }

  // Graph algorithms - use ComprehensiveGraphVisualizer
  const graphAlgorithms = ['bfs', 'dfs', 'dijkstra', 'breadth-first-search', 'depth-first-search'];
  if (graphAlgorithms.includes(algorithmId)) {
    return <ComprehensiveGraphVisualizer algorithmId={algorithmId} />;
  }

  // Default - use SimpleVisualizerPage for other algorithms
  return <SimpleVisualizerPage />;
};

export default VisualizerRouter;
