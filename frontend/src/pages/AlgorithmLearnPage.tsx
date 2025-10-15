import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Play, Clock, Database, CheckCircle, XCircle, Lightbulb, Code2, BookOpen, FileCode } from 'lucide-react';
import { getAllAlgorithms } from '../data/algorithms';
import { algorithmDetails } from '../data/algorithmDetails';
import { useState } from 'react';

const AlgorithmLearnPage = () => {
  const { algorithmId } = useParams<{ algorithmId: string }>();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState<'javascript' | 'python' | 'cpp' | 'java'>('javascript');

  // Get algorithm from main data
  const allAlgorithms = getAllAlgorithms();
  const algorithm = allAlgorithms.find(alg => alg.id === algorithmId);
  
  // Get detailed documentation
  const details = algorithmId ? (algorithmDetails as any)[algorithmId] : null;

  if (!algorithm) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Algorithm Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The algorithm you're looking for doesn't exist.
          </p>
          <Link
            to="/algorithms"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Algorithms
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </button>
          
          <Link
            to={`/visualizer/${algorithmId}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Play className="mr-2 h-4 w-4" />
            Visualize
          </Link>
        </div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Title Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-6">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3">
                  {algorithm.name}
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
                  {algorithm.description}
                </p>
                <span className="inline-block px-4 py-1.5 text-sm font-medium rounded-full bg-gradient-to-r from-blue-500 to-purple-500 text-white">
                  {algorithm.category.charAt(0).toUpperCase() + algorithm.category.slice(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Complexity Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Time Complexity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg mr-3">
                  <Clock className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Time Complexity
                </h3>
              </div>
              {details?.timeComplexity ? (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Best Case:</span>
                    <code className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 rounded font-mono text-sm">
                      {details.timeComplexity.best}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Average Case:</span>
                    <code className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-300 rounded font-mono text-sm">
                      {details.timeComplexity.average}
                    </code>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600 dark:text-gray-400">Worst Case:</span>
                    <code className="px-3 py-1 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-300 rounded font-mono text-sm">
                      {details.timeComplexity.worst}
                    </code>
                  </div>
                </div>
              ) : (
                <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded font-mono">
                  {algorithm.complexity.time}
                </code>
              )}
            </div>

            {/* Space Complexity */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-lg mr-3">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Space Complexity
                </h3>
              </div>
              <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded font-mono text-lg">
                {details?.spaceComplexity || algorithm.complexity.space}
              </code>
              {details?.stable !== undefined && (
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <span className="text-gray-600 dark:text-gray-400 mr-2">Stable:</span>
                  <span className={`font-semibold ${details.stable ? 'text-green-600' : 'text-red-600'}`}>
                    {details.stable ? 'Yes' : 'No'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Explanation */}
          {details?.explanation && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 mb-6">
              <div className="flex items-center mb-4">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  How It Works
                </h2>
              </div>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 font-sans">
                  {details.explanation}
                </pre>
              </div>
            </div>
          )}

          {/* Advantages and Disadvantages */}
          {(details?.advantages || details?.disadvantages) && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Advantages */}
              {details?.advantages && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Advantages
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {details.advantages.map((advantage: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Disadvantages */}
              {details?.disadvantages && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <XCircle className="h-6 w-6 text-red-600 dark:text-red-400 mr-3" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Disadvantages
                    </h3>
                  </div>
                  <ul className="space-y-2">
                    {details.disadvantages.map((disadvantage: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <XCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{disadvantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Use Cases */}
          {details?.useCases && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center mb-4">
                <Lightbulb className="h-6 w-6 text-yellow-600 dark:text-yellow-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Common Use Cases
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {details.useCases.map((useCase: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg"
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
                    <span className="text-gray-700 dark:text-gray-300">{useCase}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Code Implementation */}
          {details?.code && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Code2 className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Implementation
                  </h3>
                </div>
                <div className="flex gap-2">
                  {Object.keys(details.code).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang as any)}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                        selectedLanguage === lang
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {lang === 'javascript' ? 'JavaScript' : lang === 'python' ? 'Python' : lang === 'cpp' ? 'C++' : 'Java'}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <pre className="bg-gray-900 text-gray-100 p-6 rounded-xl overflow-x-auto">
                  <code className="text-sm font-mono">
                    {details.code[selectedLanguage]}
                  </code>
                </pre>
              </div>
            </div>
          )}

          {/* Dry Run Example */}
          {details?.dryRun && (
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <FileCode className="h-6 w-6 text-green-600 dark:text-green-400 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  Dry Run Example
                </h3>
              </div>
              <div className="mb-4">
                <span className="text-gray-600 dark:text-gray-400 font-medium">Input: </span>
                <code className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 rounded font-mono">
                  {Array.isArray(details.dryRun.input) 
                    ? `[${details.dryRun.input.join(', ')}]`
                    : JSON.stringify(details.dryRun.input)}
                </code>
              </div>
              <div className="space-y-3">
                {details.dryRun.steps?.map((step: any, index: number) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-600 rounded-lg border-l-4 border-blue-500"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-semibold text-gray-900 dark:text-white">
                        {step.step || step.pass ? `Step ${step.step || step.pass}` : `Step ${index + 1}`}
                      </span>
                      {step.array && (
                        <code className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-300 rounded font-mono text-sm">
                          [{step.array.join(', ')}]
                        </code>
                      )}
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {step.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AlgorithmLearnPage;
