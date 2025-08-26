import { Outlet } from 'react-router-dom';
import { useEffect } from 'react';
import Header from '../components/Layout/Header';
import Sidebar from '../components/Layout/Sidebar';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchCurrentUser } from '../store/slices/authSlice';

const MainLayout = () => {
  const dispatch = useAppDispatch();
  const { sidebarOpen } = useAppSelector((state) => state.ui);
  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (token && !sessionStorage.getItem('userFetched')) {
      dispatch(fetchCurrentUser());
      sessionStorage.setItem('userFetched', 'true');
    }
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex h-[calc(100vh-64px)]">
        <Sidebar />
        <main 
          className={`flex-1 overflow-y-auto transition-all duration-300 ${
            sidebarOpen ? 'ml-64' : 'ml-16'
          }`}
        >
          <div className="container mx-auto px-4 py-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;