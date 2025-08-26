import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

interface UIState {
  theme: 'light' | 'dark' | 'system';
  sidebarOpen: boolean;
  settingsOpen: boolean;
  fullscreen: boolean;
  notifications: Notification[];
  activeModal: string | null;
  loading: {
    global: boolean;
    [key: string]: boolean;
  };
  tour: {
    active: boolean;
    currentStep: number;
    totalSteps: number;
  };
}

const initialState: UIState = {
  theme: 'system',
  sidebarOpen: true,
  settingsOpen: false,
  fullscreen: false,
  notifications: [],
  activeModal: null,
  loading: {
    global: false,
  },
  tour: {
    active: false,
    currentStep: 0,
    totalSteps: 0,
  },
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<UIState['theme']>) => {
      state.theme = action.payload;
      // Apply theme to document
      if (typeof window !== 'undefined') {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        if (action.payload === 'system') {
          const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
          root.classList.add(systemTheme);
        } else {
          root.classList.add(action.payload);
        }
      }
    },
    toggleSidebar: (state) => {
      state.sidebarOpen = !state.sidebarOpen;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {
      state.sidebarOpen = action.payload;
    },
    toggleSettings: (state) => {
      state.settingsOpen = !state.settingsOpen;
    },
    setSettingsOpen: (state, action: PayloadAction<boolean>) => {
      state.settingsOpen = action.payload;
    },
    toggleFullscreen: (state) => {
      state.fullscreen = !state.fullscreen;
      if (typeof document !== 'undefined') {
        if (!state.fullscreen) {
          document.documentElement.requestFullscreen?.();
        } else {
          document.exitFullscreen?.();
        }
      }
    },
    addNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload);
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      state.notifications = state.notifications.filter(n => n.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.activeModal = action.payload;
    },
    closeModal: (state) => {
      state.activeModal = null;
    },
    setLoading: (state, action: PayloadAction<{ key: string; value: boolean }>) => {
      state.loading[action.payload.key] = action.payload.value;
    },
    setGlobalLoading: (state, action: PayloadAction<boolean>) => {
      state.loading.global = action.payload;
    },
    startTour: (state, action: PayloadAction<number>) => {
      state.tour.active = true;
      state.tour.currentStep = 0;
      state.tour.totalSteps = action.payload;
    },
    nextTourStep: (state) => {
      if (state.tour.currentStep < state.tour.totalSteps - 1) {
        state.tour.currentStep++;
      } else {
        state.tour.active = false;
      }
    },
    previousTourStep: (state) => {
      if (state.tour.currentStep > 0) {
        state.tour.currentStep--;
      }
    },
    endTour: (state) => {
      state.tour.active = false;
      state.tour.currentStep = 0;
    },
  },
});

export const {
  setTheme,
  toggleSidebar,
  setSidebarOpen,
  toggleSettings,
  setSettingsOpen,
  toggleFullscreen,
  addNotification,
  removeNotification,
  clearNotifications,
  openModal,
  closeModal,
  setLoading,
  setGlobalLoading,
  startTour,
  nextTourStep,
  previousTourStep,
  endTour,
} = uiSlice.actions;

export default uiSlice.reducer;