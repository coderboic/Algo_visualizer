import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import LoadingScreen from '../components/common/LoadingScreen';
import ProtectedRoute from '../components/auth/ProtectedRoute';

// Lazy load pages for better performance
const HomePage = lazy(() => import('../pages/HomePage'));
const PlaygroundPage = lazy(() => import('../pages/PlaygroundPage'));
const VisualizerPage = lazy(() => import('../pages/VisualizerPage'));
const TutorialsPage = lazy(() => import('../pages/TutorialsPage'));
const LoginPage = lazy(() => import('../pages/LoginPage'));
const RegisterPage = lazy(() => import('../pages/RegisterPage'));
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
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            <Route path="/playground" element={<PlaygroundPage />} />
            <Route path="/playground/:algorithmId" element={<PlaygroundPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
        </Route>

        {/* Fallback routes */}
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;