import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import TestPage from './components/TestPage';
import SimpleHomePage from './components/SimpleHomePage';
import AlgorithmsPage from './components/AlgorithmsPage';
import SimpleHeader from './components/SimpleHeader';
import SimpleVisualizerPage from './pages/SimpleVisualizerPage';
import PlaygroundPage from './pages/PlaygroundPage';
import { useAppDispatch } from './store/hooks';
import { setTheme } from './store/slices/uiSlice';

function App() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize with light theme for a modern look
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | 'system' | null;
    if (savedTheme === 'dark') {
      document.documentElement.classList.add('dark');
      dispatch(setTheme('dark'));
    } else {
      // Default to light theme
      document.documentElement.classList.remove('dark');
      dispatch(setTheme('light'));
      localStorage.setItem('theme', 'light');
    }

    // Listen for system theme changes
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const theme = localStorage.getItem('theme');
      if (theme === 'system') {
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(e.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <SimpleHeader />
      <main className="animate-fade-in">
        <Routes>
          <Route path="/" element={<SimpleHomePage />} />
          <Route path="/algorithms" element={<AlgorithmsPage />} />
          <Route path="/algorithms/:category" element={<AlgorithmsPage />} />
          <Route path="/visualizer/:algorithmId" element={<SimpleVisualizerPage />} />
          <Route path="/algorithm/:algorithmId" element={<SimpleVisualizerPage />} />
          <Route path="/playground" element={<PlaygroundPage />} />
          <Route path="/test" element={<TestPage />} />
          <Route path="*" element={<SimpleHomePage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
