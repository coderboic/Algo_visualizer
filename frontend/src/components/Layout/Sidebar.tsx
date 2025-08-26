import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Home, Code, Play, BookOpen, Settings, User, LogIn, ChevronDown, ChevronRight } from 'lucide-react';
import { useAppSelector } from '../../store/hooks';
import { motion } from 'framer-motion';
import { useAlgorithm } from '../../contexts/AlgorithmContext';

const Sidebar = () => {
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const { algorithms, loadAlgorithms } = useAlgorithm();
  const location = useLocation();
  
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    sorting: true,
    searching: false,
    graph: false,
    tree: false,
    'dynamic-programming': false,
  });

  useEffect(() => {
    if (algorithms.length === 0) {
      loadAlgorithms();
    }
  }, [algorithms, loadAlgorithms]);

  const navItems = [
    { to: '/', icon: Home, label: 'Home', public: true },
    { to: '/algorithms', icon: Code, label: 'Algorithms', public: true },
    { to: '/playground', icon: Play, label: 'Playground', public: true },
    { to: '/tutorials', icon: BookOpen, label: 'Tutorials', public: true },
    { to: '/profile', icon: User, label: 'Profile', public: false },
    { to: '/settings', icon: Settings, label: 'Settings', public: false },
  ];

  const filteredNavItems = navItems.filter(item => item.public || isAuthenticated);
  
  // Group algorithms by category
  const algorithmsByCategory = algorithms.reduce((acc, algorithm) => {
    if (!acc[algorithm.category]) {
      acc[algorithm.category] = [];
    }
    acc[algorithm.category].push(algorithm);
    return acc;
  }, {} as Record<string, typeof algorithms>);
  
  const toggleCategory = (category: string) => {
    setExpandedCategories({
      ...expandedCategories,
      [category]: !expandedCategories[category],
    });
  };
  
  const getCategoryLabel = (category: string): string => {
    switch (category) {
      case 'sorting': return 'Sorting Algorithms';
      case 'searching': return 'Searching Algorithms';
      case 'graph': return 'Graph Algorithms';
      case 'tree': return 'Tree Algorithms';
      case 'dynamic-programming': return 'Dynamic Programming';
      default: return category.charAt(0).toUpperCase() + category.slice(1);
    }
  };

  return (
    <motion.aside
      animate={{
        width: sidebarOpen ? 280 : 64,
      }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 h-full fixed left-0 top-16 z-40 overflow-y-auto"
    >
      <nav className="p-4">
        <ul className="space-y-2">
          {filteredNavItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive || (item.to === '/algorithms' && location.pathname.includes('/visualizer'))
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="ml-3"
                  >
                    {item.label}
                  </motion.span>
                )}
              </NavLink>
              
              {/* Show algorithm categories when on the algorithms page and sidebar is open */}
              {item.to === '/algorithms' && sidebarOpen && Object.keys(algorithmsByCategory).length > 0 && (
                <div className="mt-2 ml-2 border-l-2 border-gray-200 dark:border-gray-700 pl-2">
                  {Object.entries(algorithmsByCategory).map(([category, algs]) => (
                    <div key={category} className="mb-1">
                      <button 
                        onClick={() => toggleCategory(category)}
                        className="flex items-center w-full text-left px-2 py-1 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                      >
                        {expandedCategories[category] ? 
                          <ChevronDown className="h-4 w-4 mr-1" /> : 
                          <ChevronRight className="h-4 w-4 mr-1" />}
                        {getCategoryLabel(category)} ({algs.length})
                      </button>
                      
                      {expandedCategories[category] && (
                        <ul className="ml-5 space-y-1 mt-1">
                          {algs.map(algorithm => (
                            <li key={algorithm.id}>
                              <NavLink
                                to={`/visualizer/${algorithm.id}`}
                                className={({ isActive }) =>
                                  `block px-2 py-1 text-sm rounded-md ${
                                    isActive
                                      ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-gray-200'
                                  }`
                                }
                              >
                                {algorithm.name}
                              </NavLink>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </li>
          ))}
          
          {!isAuthenticated && (
            <li>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-md transition-colors ${
                    isActive
                      ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`
                }
              >
                <LogIn className="h-5 w-5 flex-shrink-0" />
                {sidebarOpen && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="ml-3"
                  >
                    Login
                  </motion.span>
                )}
              </NavLink>
            </li>
          )}
        </ul>
      </nav>
    </motion.aside>
  );
};

export default Sidebar;