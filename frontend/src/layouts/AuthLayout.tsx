import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';

const AuthLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Redirect to home if already authenticated
  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-lg p-8">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Algorithm Visualizer
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Learn algorithms through interactive visualization
            </p>
          </div>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;