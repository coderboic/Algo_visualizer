import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface VisualizationStep {
  id: string;
  description: string;
  data: any[];
  highlightedIndices: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  code: string;
  lineNumber: number;
  variables: Record<string, any>;
}

interface VisualizationState {
  steps: VisualizationStep[];
  currentStepIndex: number;
  isPlaying: boolean;
  speed: number; // milliseconds between steps
  inputData: any[];
  outputData: any[];
  visualizationType: 'bars' | 'graph' | 'tree' | 'array' | 'matrix';
  status: 'idle' | 'running' | 'paused' | 'completed';
}

const initialState: VisualizationState = {
  steps: [],
  currentStepIndex: 0,
  isPlaying: false,
  speed: 1000,
  inputData: [],
  outputData: [],
  visualizationType: 'bars',
  status: 'idle',
};

const visualizationSlice = createSlice({
  name: 'visualization',
  initialState,
  reducers: {
    setSteps: (state, action: PayloadAction<VisualizationStep[]>) => {
      state.steps = action.payload;
      state.currentStepIndex = 0;
      state.status = 'idle';
    },
    nextStep: (state) => {
      if (state.currentStepIndex < state.steps.length - 1) {
        state.currentStepIndex++;
      } else {
        state.isPlaying = false;
        state.status = 'completed';
      }
    },
    previousStep: (state) => {
      if (state.currentStepIndex > 0) {
        state.currentStepIndex--;
        state.status = 'paused';
      }
    },
    goToStep: (state, action: PayloadAction<number>) => {
      if (action.payload >= 0 && action.payload < state.steps.length) {
        state.currentStepIndex = action.payload;
      }
    },
    play: (state) => {
      state.isPlaying = true;
      state.status = 'running';
    },
    pause: (state) => {
      state.isPlaying = false;
      state.status = 'paused';
    },
    reset: (state) => {
      state.currentStepIndex = 0;
      state.isPlaying = false;
      state.status = 'idle';
    },
    setSpeed: (state, action: PayloadAction<number>) => {
      state.speed = action.payload;
    },
    setInputData: (state, action: PayloadAction<any[]>) => {
      state.inputData = action.payload;
    },
    setOutputData: (state, action: PayloadAction<any[]>) => {
      state.outputData = action.payload;
    },
    setVisualizationType: (state, action: PayloadAction<VisualizationState['visualizationType']>) => {
      state.visualizationType = action.payload;
    },
    updateVisualizationData: (state, action: PayloadAction<Partial<VisualizationState>>) => {
      Object.assign(state, action.payload);
    },
  },
});

export const {
  setSteps,
  nextStep,
  previousStep,
  goToStep,
  play,
  pause,
  reset,
  setSpeed,
  setInputData,
  setOutputData,
  setVisualizationType,
  updateVisualizationData,
} = visualizationSlice.actions;

export default visualizationSlice.reducer;