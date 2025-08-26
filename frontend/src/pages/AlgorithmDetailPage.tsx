import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Clock, Database, Code, BookOpen, ArrowLeft } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchAlgorithmById } from '../store/slices/algorithmSlice';
import LoadingScreen from '../components/common/LoadingScreen';

const AlgorithmDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { selectedAlgorithm, loading } = useAppSelector((state) => state.algorithm);

  useEffect(() => {
    if (id) {
      dispatch(fetchAlgorithmById(id));
    }
  }, [id, dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (!selectedAlgorithm) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">Algorithm not found</p>
        <Link to="/" className="text-blue-600 hover:text-blue-700 mt-4 inline-block">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto"
    >
      <Link
        to="/"
        className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Algorithms
      </Link>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {selectedAlgorithm.name}
            </h1>
            <span className="inline-block px-3 py-1 text-sm font-medium rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {selectedAlgorithm.category}
            </span>
          </div>
          
          <Link
            to={`/visualizer/${selectedAlgorithm.id}`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <Play className="mr-2 h-4 w-4" />
            Visualize
          </Link>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {selectedAlgorithm.description}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Clock className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Time Complexity</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-gray-600 dark:text-gray-400">
                Best: <span className="font-mono">{selectedAlgorithm.timeComplexity?.best}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Average: <span className="font-mono">{selectedAlgorithm.timeComplexity?.average}</span>
              </p>
              <p className="text-gray-600 dark:text-gray-400">
                Worst: <span className="font-mono">{selectedAlgorithm.timeComplexity?.worst}</span>
              </p>
            </div>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <Database className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Space Complexity</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              <span className="font-mono">{selectedAlgorithm.spaceComplexity}</span>
            </p>
          </div>

          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <BookOpen className="h-5 w-5 text-purple-600 dark:text-purple-400 mr-2" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Category</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm capitalize">
              {selectedAlgorithm.category}
            </p>
          </div>
        </div>

        {selectedAlgorithm.pseudocode && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Pseudocode
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{selectedAlgorithm.pseudocode}</code>
            </pre>
          </div>
        )}

        {selectedAlgorithm.implementation && (
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
              <Code className="mr-2 h-5 w-5" />
              Implementation
            </h2>
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
              <code>{selectedAlgorithm.implementation}</code>
            </pre>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AlgorithmDetailPage;