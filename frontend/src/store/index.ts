import { configureStore } from '@reduxjs/toolkit';
import algorithmReducer from './slices/algorithmSlice';
import visualizationReducer from './slices/visualizationSlice';
import executionReducer from './slices/executionSlice';
import uiReducer from './slices/uiSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
  reducer: {
    algorithm: algorithmReducer,
    visualization: visualizationReducer,
    execution: executionReducer,
    ui: uiReducer,
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types
        ignoredActions: ['visualization/updateVisualizationData'],
        // Ignore these field paths in all actions
        ignoredActionPaths: ['payload.timestamp'],
        // Ignore these paths in the state
        ignoredPaths: ['visualization.currentStep'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;