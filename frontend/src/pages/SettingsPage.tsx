import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Globe, Shield, Palette } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setTheme } from '../store/slices/uiSlice';

const SettingsPage = () => {
  const dispatch = useAppDispatch();
  const { theme } = useAppSelector((state) => state.ui);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-4xl mx-auto"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="space-y-6">
        {/* Appearance Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Appearance
          </h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Theme
              </label>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => dispatch(setTheme('light'))}
                  className={`p-3 rounded-lg border-2 ${
                    theme === 'light'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Sun className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">Light</span>
                </button>
                <button
                  onClick={() => dispatch(setTheme('dark'))}
                  className={`p-3 rounded-lg border-2 ${
                    theme === 'dark'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Moon className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">Dark</span>
                </button>
                <button
                  onClick={() => dispatch(setTheme('system'))}
                  className={`p-3 rounded-lg border-2 ${
                    theme === 'system'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900'
                      : 'border-gray-300 dark:border-gray-600'
                  }`}
                >
                  <Globe className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm">System</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notification Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Bell className="mr-2 h-5 w-5" />
            Notifications
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Email notifications
              </span>
              <input
                type="checkbox"
                className="toggle-checkbox"
                defaultChecked
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Push notifications
              </span>
              <input
                type="checkbox"
                className="toggle-checkbox"
              />
            </label>
          </div>
        </div>

        {/* Privacy Settings */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Shield className="mr-2 h-5 w-5" />
            Privacy
          </h2>
          
          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Make profile public
              </span>
              <input
                type="checkbox"
                className="toggle-checkbox"
                defaultChecked
              />
            </label>
            
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">
                Show activity status
              </span>
              <input
                type="checkbox"
                className="toggle-checkbox"
                defaultChecked
              />
            </label>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Save Changes
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default SettingsPage;