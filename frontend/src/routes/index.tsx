import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoadingScreen from '../components/common/LoadingScreen';
import ProtectedRoute from '../components/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const PlaygroundPage = lazy(() => import('../pages/PlaygroundPage'));
const VisualizerPage = lazy(() => import('../pages/VisualizerPage'));
const TutorialsPage = lazy(() => import('../pages/TutorialsPage'));
const AuthLoginPage = lazy(() => import('../pages/AuthLoginPage'));
const AuthSignupPage = lazy(() => import('../pages/AuthSignupPage'));
const ProfilePage = lazy(() => import('../pages/ProfilePage'));
const SettingsPage = lazy(() => import('../pages/SettingsPage'));
const AlgorithmDetailPage = lazy(() => import('../pages/AlgorithmDetailPage'));
const NotFoundPage = lazy(() => import('../pages/NotFoundPage'));

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/algorithms" element={<HomePage />} />
          <Route path="/algorithms/:category" element={<HomePage />} />
          <Route path="/algorithm/:id" element={<AlgorithmDetailPage />} />
          <Route path="/visualizer/:algorithmId" element={<VisualizerPage />} />
          <Route path="/tutorials" element={<TutorialsPage />} />
          <Route path="/tutorials/:tutorialId" element={<TutorialsPage />} />
        </Route>

        {/* Auth routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<AuthLoginPage />} />
          <Route path="/signup" element={<AuthSignupPage />} />
          <Route path="/register" element={<Navigate to="/signup" replace />} />
        </Route>

        {/* Protected routes */}
        <Route element={<MainLayout />}>
          <Route element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} path="/playground" />
          <Route element={<ProtectedRoute><PlaygroundPage /></ProtectedRoute>} path="/playground/:algorithmId" />
          <Route element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} path="/profile" />
          <Route element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} path="/settings" />
        </Route>

        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;