import React, { useState } from 'react';
import { Clock, Cpu, Info, X, Code, BookOpen, List, LineChart } from 'lucide-react';
import type { Algorithm } from '../contexts/AlgorithmContext';

interface AlgorithmInfoProps {
  algorithm: Algorithm;
  onVisualize?: () => void;
  onTryCode?: () => void;
}

const AlgorithmInfo: React.FC<AlgorithmInfoProps> = ({ algorithm, onVisualize, onTryCode }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {algorithm.name}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {algorithm.description}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Time Complexity</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {algorithm.complexity.time}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            <div>
              <p className="text-xs text-gray-500 dark:text-gray-400">Space Complexity</p>
              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                {algorithm.complexity.space}
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            {onVisualize && (
              <button
                onClick={onVisualize}
                className="px-3 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <LineChart className="w-4 h-4" />
                Visualize
              </button>
            )}

            {onTryCode && (
              <button
                onClick={onTryCode}
                className="px-3 py-2 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2"
              >
                <Code className="w-4 h-4" />
                Try in Playground
              </button>
            )}

            <button
              onClick={() => setShowDetails(true)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              aria-label="Show algorithm details"
            >
              <Info className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetails && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                {algorithm.name} Details
              </h2>
              <button
                onClick={() => setShowDetails(false)}
                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <BookOpen className="w-5 h-5" /> Overview
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {algorithm.description}
                </p>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                  <List className="w-5 h-5" /> Key Characteristics
                </h3>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>Time Complexity: <span className="font-mono">{algorithm.complexity.time}</span></li>
                  <li>Space Complexity: <span className="font-mono">{algorithm.complexity.space}</span></li>
                  <li>Category: {algorithm.category.charAt(0).toUpperCase() + algorithm.category.slice(1)}</li>
                  {algorithm.category === 'sorting' && (
                    <>
                      <li>Stable: {algorithm.id.includes('merge') || algorithm.id.includes('bubble') || algorithm.id.includes('insertion') ? 'Yes' : 'No'}</li>
                      <li>In-place: {algorithm.id.includes('bubble') || algorithm.id.includes('quick') || algorithm.id.includes('selection') || algorithm.id.includes('insertion') || algorithm.id.includes('heap') ? 'Yes' : 'No'}</li>
                    </>
                  )}
                </ul>
              </div>

              {algorithm.code && (
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center gap-2 mb-2">
                    <Code className="w-5 h-5" /> Implementation
                  </h3>
                  <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm font-mono text-gray-800 dark:text-gray-200">
                    {algorithm.code}
                  </pre>
                </div>
              )}
            </div>

            <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowDetails(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AlgorithmInfo;