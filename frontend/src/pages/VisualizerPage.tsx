import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAlgorithm } from '../contexts/AlgorithmContext';
import SortingVisualizer from '../components/Visualizers/SortingVisualizer';
import CanvasGraphVisualizer from '../components/Visualizers/CanvasGraphVisualizer';
import VisualizationControls from '../components/Controls/VisualizationControls';
import AlgorithmInfo from '../components/AlgorithmInfo/AlgorithmInfo';
import { Loader2, Code } from 'lucide-react';

const VisualizerPage: React.FC = () => {
  const { algorithmId } = useParams<{ algorithmId?: string }>();
  const navigate = useNavigate();
  
  const {
    algorithms,
    currentAlgorithm,
    visualizationSteps,
    currentStep,
    isPlaying,
    speed,
    loading,
    error,
    loadAlgorithms,
    selectAlgorithm,
    generateVisualization,
    play,
    pause,
    reset,
    stepForward,
    stepBackward,
    setSpeed,
    setCurrentStep
  } = useAlgorithm();

  const [inputArray, setInputArray] = useState<number[]>([64, 34, 25, 12, 22, 11, 90, 88, 45, 50, 43, 24, 58, 33, 77]);
  const [arraySize, setArraySize] = useState(15);
  const [customInput, setCustomInput] = useState('');

  useEffect(() => {
    if (algorithms.length === 0) {
      loadAlgorithms();
    }
  }, [algorithms, loadAlgorithms]);

  useEffect(() => {
    if (algorithmId && algorithms.length > 0) {
      selectAlgorithm(algorithmId);
    }
  }, [algorithmId, algorithms, selectAlgorithm]);

  useEffect(() => {
    if (currentAlgorithm && inputArray.length > 0) {
      generateVisualization({ array: inputArray });
    }
  }, [currentAlgorithm, inputArray, generateVisualization]);

  const generateRandomArray = () => {
    const newArray = Array.from({ length: arraySize }, () => 
      Math.floor(Math.random() * 100) + 1
    );
    setInputArray(newArray);
  };

  const handleCustomInput = () => {
    const numbers = customInput
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n));
    
    if (numbers.length > 0) {
      setInputArray(numbers);
      setArraySize(numbers.length);
    }
  };

  const navigateToPlayground = () => {
    navigate(`/playground?algorithm=${currentAlgorithm?.id}`);
  };

  const getVisualizerComponent = () => {
    if (!currentAlgorithm) return null;

    switch (currentAlgorithm.category.toLowerCase()) {
      case 'sorting':
        return (
          <SortingVisualizer
            algorithm={currentAlgorithm.name}
            onStepChange={(step) => setCurrentStep(step)}
          />
        );
      case 'searching':
        // Simplified for now - would need to implement SearchingVisualizer
        return <div className="text-center py-20 text-gray-600 dark:text-gray-400">
          <div className="mb-4">Searching visualizer coming soon!</div>
          <button 
            onClick={navigateToPlayground}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Code className="inline-block mr-2 h-4 w-4" />
            Try in Playground Instead
          </button>
        </div>;
      case 'graph':
        return (
          <CanvasGraphVisualizer 
            algorithm={currentAlgorithm.name} 
            onStepChange={(step) => setCurrentStep(step)}
          />
        );
      case 'tree':
        // Simplified for now - would need to implement TreeVisualizer
        return <div className="text-center py-20 text-gray-600 dark:text-gray-400">
          <div className="mb-4">Tree visualizer coming soon!</div>
          <button 
            onClick={navigateToPlayground}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Code className="inline-block mr-2 h-4 w-4" />
            Try in Playground Instead
          </button>
        </div>;
      case 'dynamic-programming':
        return <div className="text-center py-20 text-gray-600 dark:text-gray-400">
          <div className="mb-4">Dynamic Programming visualizer coming soon!</div>
          <button 
            onClick={navigateToPlayground}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Code className="inline-block mr-2 h-4 w-4" />
            Try in Playground Instead
          </button>
        </div>;
      default:
        return <div className="text-center py-20 text-gray-600 dark:text-gray-400">
          <div className="mb-4">Visualizer not available for this algorithm</div>
          <button 
            onClick={navigateToPlayground}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Code className="inline-block mr-2 h-4 w-4" />
            Try in Playground Instead
          </button>
        </div>;
    }
  };

  if (loading && algorithms.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  if (!currentAlgorithm) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-500">Please select an algorithm from the sidebar</div>
      </div>
    );
  }



  return (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Algorithm Info Bar */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <AlgorithmInfo 
          algorithm={currentAlgorithm} 
          onTryCode={navigateToPlayground} 
        />
      </div>

      {/* Input Controls - Only show for certain algorithm types */}
      {currentAlgorithm.category === 'sorting' && (
        <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Array Size:
              </label>
              <input
                type="range"
                min="5"
                max="50"
                value={arraySize}
                onChange={(e) => setArraySize(parseInt(e.target.value))}
                className="w-32"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400 w-8">{arraySize}</span>
            </div>
            
            <button
              onClick={generateRandomArray}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
            >
              Generate Random Array
            </button>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Enter comma-separated values"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
              />
              <button
                onClick={handleCustomInput}
                className="px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors text-sm font-medium"
              >
                Use Custom
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Visualization Area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          {getVisualizerComponent()}
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
        <VisualizationControls
          isPlaying={isPlaying}
          currentStep={currentStep}
          totalSteps={visualizationSteps.length}
          speed={speed}
          onPlay={play}
          onPause={pause}
          onReset={reset}
          onStepForward={stepForward}
          onStepBackward={stepBackward}
          onSpeedChange={setSpeed}
          onStepChange={setCurrentStep}
        />
      </div>
    </div>
  );
};

export default VisualizerPage;