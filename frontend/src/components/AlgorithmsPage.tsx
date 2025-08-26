import { useParams, Link } from 'react-router-dom';
import { algorithmCategories, getAllAlgorithms } from '../data/algorithms';
import { useState } from 'react';

const AlgorithmsPage = () => {
  const { category } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [complexityFilter, setComplexityFilter] = useState('all');
  
  const selectedCategory = category 
    ? algorithmCategories.find(cat => cat.id === category)
    : null;
    
  let algorithms = selectedCategory 
    ? selectedCategory.algorithms.map(alg => ({ ...alg, categoryName: selectedCategory.name }))
    : getAllAlgorithms();

  // Apply filters
  if (searchTerm) {
    algorithms = algorithms.filter(alg => 
      alg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alg.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (complexityFilter !== 'all') {
    algorithms = algorithms.filter(alg => 
      alg.complexity.time.toLowerCase().includes(complexityFilter.toLowerCase())
    );
  }

  const complexityColors = {
    'O(1)': 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30',
    'O(log n)': 'text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30',
    'O(n)': 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/30',
    'O(n log n)': 'text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30',
    'O(n²)': 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
    'O(2^n)': 'text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30',
  };

  const getComplexityColor = (complexity: string) => {
    return complexityColors[complexity as keyof typeof complexityColors] || 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/30';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <nav className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 mb-8">
            <Link to="/" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Home
            </Link>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
            <span className="text-gray-900 dark:text-white font-medium">Algorithms</span>
            {selectedCategory && (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                <span className="text-gray-900 dark:text-white font-medium">{selectedCategory.name}</span>
              </>
            )}
          </nav>
          
          <div className="max-w-4xl">
            <h1 className="text-5xl font-bold mb-4">
              {selectedCategory ? (
                <span className="text-gradient">{selectedCategory.name}</span>
              ) : (
                <span className="text-gradient">All Algorithms</span>
              )}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              {selectedCategory 
                ? selectedCategory.description 
                : 'Explore our comprehensive collection of algorithm visualizations'
              }
            </p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filters and Search */}
        <div className="mb-12">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Search Bar */}
            <div className="relative w-full lg:w-96">
              <input
                type="text"
                placeholder="Search algorithms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="modern-input pl-12"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Filters */}
            <div className="flex gap-4 items-center">
              <select
                value={complexityFilter}
                onChange={(e) => setComplexityFilter(e.target.value)}
                className="modern-input"
              >
                <option value="all">All Complexities</option>
                <option value="1">O(1) - Constant</option>
                <option value="log">O(log n) - Logarithmic</option>
                <option value="n)">O(n) - Linear</option>
                <option value="n log">O(n log n)</option>
                <option value="n²">O(n²) - Quadratic</option>
              </select>

              <div className="text-sm text-gray-600 dark:text-gray-400">
                {algorithms.length} algorithms found
              </div>
            </div>
          </div>
        </div>

        {/* Categories Grid (if not in a specific category) */}
        {!selectedCategory && (
          <div className="mb-16">
            <h2 className="text-3xl font-bold mb-8 text-gradient">Browse by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {algorithmCategories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/algorithms/${cat.id}`}
                  className="group"
                >
                  <div className="modern-card modern-card-hover p-6 h-full">
                    <div className="flex items-start justify-between mb-4">
                      <h3 className="text-2xl font-bold text-gradient group-hover:scale-105 transition-transform">
                        {cat.name}
                      </h3>
                      <span className="badge badge-blue">
                        {cat.algorithms.length}
                      </span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      {cat.description}
                    </p>
                    <div className="flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                      View Algorithms
                      <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Algorithms Grid */}
        <div>
          <h2 className="text-3xl font-bold mb-8 text-gradient">
            {selectedCategory ? `${selectedCategory.name} Algorithms` : 'All Algorithms'}
          </h2>
          
          {algorithms.length === 0 ? (
            <div className="text-center py-12">
              <svg className="w-24 h-24 mx-auto text-gray-300 dark:text-gray-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-gray-600 dark:text-gray-400">No algorithms found</p>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your search or filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {algorithms.map((algorithm) => (
                <div 
                  key={algorithm.id}
                  className="algorithm-card group"
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-gradient transition-all">
                      {algorithm.name}
                    </h3>
                    {!selectedCategory && (
                      <span className="badge badge-purple">
                        {algorithm.categoryName}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                    {algorithm.description}
                  </p>
                  
                  {/* Complexity Badges */}
                  <div className="flex gap-2 mb-6">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getComplexityColor(algorithm.complexity.time)}`}>
                      Time: {algorithm.complexity.time}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getComplexityColor(algorithm.complexity.space)}`}>
                      Space: {algorithm.complexity.space}
                    </span>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex gap-3">
                    <Link
                      to={`/visualizer/${algorithm.id}`}
                      className="flex-1 btn-primary py-2 text-center text-sm"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Visualize
                      </span>
                    </Link>
                    <Link
                      to={`/algorithm/${algorithm.id}`}
                      className="flex-1 btn-outline py-2 text-center text-sm"
                    >
                      <span className="flex items-center justify-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        Learn
                      </span>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
