import React, { useState } from 'react';
import { BookOpen, Clock, Award, ChevronRight, Search, Filter } from 'lucide-react';
import { Link } from 'react-router-dom';

interface Tutorial {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  algorithms: string[];
  completed?: boolean;
}

const TutorialsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  const tutorials: Tutorial[] = [
    {
      id: '1',
      title: 'Introduction to Sorting Algorithms',
      description: 'Learn the fundamentals of sorting algorithms and their applications',
      category: 'Sorting',
      difficulty: 'Beginner',
      duration: '30 min',
      algorithms: ['bubble-sort', 'selection-sort', 'insertion-sort']
    },
    {
      id: '2',
      title: 'Advanced Sorting Techniques',
      description: 'Master efficient sorting algorithms like Quick Sort and Merge Sort',
      category: 'Sorting',
      difficulty: 'Intermediate',
      duration: '45 min',
      algorithms: ['quick-sort', 'merge-sort', 'heap-sort']
    },
    {
      id: '3',
      title: 'Binary Search and Variations',
      description: 'Understand binary search and its various applications',
      category: 'Searching',
      difficulty: 'Beginner',
      duration: '25 min',
      algorithms: ['binary-search', 'jump-search']
    },
    {
      id: '4',
      title: 'Graph Traversal Algorithms',
      description: 'Explore BFS and DFS for graph traversal',
      category: 'Graph',
      difficulty: 'Intermediate',
      duration: '40 min',
      algorithms: ['bfs', 'dfs']
    },
    {
      id: '5',
      title: 'Shortest Path Algorithms',
      description: "Learn Dijkstra's and Bellman-Ford algorithms",
      category: 'Graph',
      difficulty: 'Advanced',
      duration: '60 min',
      algorithms: ['dijkstra', 'bellman-ford']
    },
    {
      id: '6',
      title: 'Binary Search Trees',
      description: 'Understanding BST operations and balancing',
      category: 'Tree',
      difficulty: 'Intermediate',
      duration: '35 min',
      algorithms: ['bst-insert', 'bst-search', 'avl-tree']
    },
    {
      id: '7',
      title: 'Dynamic Programming Basics',
      description: 'Introduction to dynamic programming concepts',
      category: 'Dynamic Programming',
      difficulty: 'Advanced',
      duration: '50 min',
      algorithms: ['fibonacci', 'knapsack']
    },
    {
      id: '8',
      title: 'String Algorithms',
      description: 'Learn algorithms for string manipulation and pattern matching',
      category: 'Dynamic Programming',
      difficulty: 'Advanced',
      duration: '55 min',
      algorithms: ['lcs', 'edit-distance']
    }
  ];

  const categories = ['all', 'Sorting', 'Searching', 'Graph', 'Tree', 'Dynamic Programming'];
  const difficulties = ['all', 'Beginner', 'Intermediate', 'Advanced'];

  const filteredTutorials = tutorials.filter(tutorial => {
    const matchesSearch = tutorial.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tutorial.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tutorial.category === selectedCategory;
    const matchesDifficulty = selectedDifficulty === 'all' || tutorial.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesDifficulty;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Beginner':
        return 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300';
      case 'Intermediate':
        return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300';
      case 'Advanced':
        return 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
        <div className="container mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                <BookOpen className="w-8 h-8 text-primary-500" />
                Algorithm Tutorials
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                Learn algorithms step by step with interactive tutorials
              </p>
            </div>
            
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">Progress</p>
              <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                0 / {tutorials.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-wrap gap-4">
          {/* Search */}
          <div className="flex-1 min-w-[300px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search tutorials..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'all' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          {/* Difficulty Filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {difficulties.map(difficulty => (
              <option key={difficulty} value={difficulty}>
                {difficulty === 'all' ? 'All Levels' : difficulty}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Tutorials Grid */}
      <div className="container mx-auto px-6 pb-12">
        {filteredTutorials.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutorials.map(tutorial => (
              <div
                key={tutorial.id}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow overflow-hidden group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tutorial.difficulty)}`}>
                      {tutorial.difficulty}
                    </span>
                    {tutorial.completed && (
                      <Award className="w-5 h-5 text-green-500" />
                    )}
                  </div>

                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {tutorial.title}
                  </h3>
                  
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {tutorial.description}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                    <div className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {tutorial.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <Filter className="w-4 h-4" />
                      {tutorial.category}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {tutorial.algorithms.slice(0, 3).map(algo => (
                      <span
                        key={algo}
                        className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400"
                      >
                        {algo}
                      </span>
                    ))}
                    {tutorial.algorithms.length > 3 && (
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded text-xs text-gray-600 dark:text-gray-400">
                        +{tutorial.algorithms.length - 3} more
                      </span>
                    )}
                  </div>

                  <Link
                    to={`/tutorials/${tutorial.id}`}
                    className="flex items-center justify-between w-full px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-colors group"
                  >
                    <span className="font-medium">Start Tutorial</span>
                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">
              No tutorials found matching your criteria
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TutorialsPage;