import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

export interface ExecutionResult {
  id: string;
  algorithmId: string;
  input: any;
  output: any;
  steps: any[];
  executionTime: number;
  memoryUsed: number;
  timestamp: Date;
  status: 'success' | 'error' | 'timeout';
  error?: string;
}

interface ExecutionState {
  currentExecution: ExecutionResult | null;
  executionHistory: ExecutionResult[];
  isExecuting: boolean;
  customCode: string;
  language: 'javascript' | 'python' | 'java' | 'cpp';
  testCases: Array<{
    id: string;
    input: any;
    expectedOutput: any;
    description: string;
  }>;
  loading: boolean;
  error: string | null;
}

const initialState: ExecutionState = {
  currentExecution: null,
  executionHistory: [],
  isExecuting: false,
  customCode: '',
  language: 'javascript',
  testCases: [],
  loading: false,
  error: null,
};

// Async thunks
export const executeAlgorithm = createAsyncThunk(
  'execution/executeAlgorithm',
  async ({ algorithmId, input, customCode }: { 
    algorithmId: string; 
    input: any; 
    customCode?: string 
  }) => {
    const response = await axios.post('/api/execution/execute', {
      algorithmId,
      input,
      customCode,
    });
    return response.data;
  }
);

export const runTestCases = createAsyncThunk(
  'execution/runTestCases',
  async ({ algorithmId, testCases, customCode }: {
    algorithmId: string;
    testCases: any[];
    customCode?: string;
  }) => {
    const response = await axios.post('/api/execution/test', {
      algorithmId,
      testCases,
      customCode,
    });
    return response.data;
  }
);

const executionSlice = createSlice({
  name: 'execution',
  initialState,
  reducers: {
    setCustomCode: (state, action: PayloadAction<string>) => {
      state.customCode = action.payload;
    },
    setLanguage: (state, action: PayloadAction<ExecutionState['language']>) => {
      state.language = action.payload;
    },
    addTestCase: (state, action: PayloadAction<ExecutionState['testCases'][0]>) => {
      state.testCases.push(action.payload);
    },
    removeTestCase: (state, action: PayloadAction<string>) => {
      state.testCases = state.testCases.filter(tc => tc.id !== action.payload);
    },
    updateTestCase: (state, action: PayloadAction<ExecutionState['testCases'][0]>) => {
      const index = state.testCases.findIndex(tc => tc.id === action.payload.id);
      if (index !== -1) {
        state.testCases[index] = action.payload;
      }
    },
    clearExecution: (state) => {
      state.currentExecution = null;
      state.error = null;
    },
    addToHistory: (state, action: PayloadAction<ExecutionResult>) => {
      state.executionHistory.unshift(action.payload);
      // Keep only last 10 executions
      if (state.executionHistory.length > 10) {
        state.executionHistory.pop();
      }
    },
    clearHistory: (state) => {
      state.executionHistory = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Execute algorithm
      .addCase(executeAlgorithm.pending, (state) => {
        state.isExecuting = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(executeAlgorithm.fulfilled, (state, action) => {
        state.isExecuting = false;
        state.loading = false;
        state.currentExecution = action.payload;
        state.executionHistory.unshift(action.payload);
        if (state.executionHistory.length > 10) {
          state.executionHistory.pop();
        }
      })
      .addCase(executeAlgorithm.rejected, (state, action) => {
        state.isExecuting = false;
        state.loading = false;
        state.error = action.error.message || 'Execution failed';
      })
      // Run test cases
      .addCase(runTestCases.pending, (state) => {
        state.isExecuting = true;
        state.loading = true;
        state.error = null;
      })
      .addCase(runTestCases.fulfilled, (state) => {
        state.isExecuting = false;
        state.loading = false;
        // Handle test results
      })
      .addCase(runTestCases.rejected, (state, action) => {
        state.isExecuting = false;
        state.loading = false;
        state.error = action.error.message || 'Test execution failed';
      });
  },
});

export const {
  setCustomCode,
  setLanguage,
  addTestCase,
  removeTestCase,
  updateTestCase,
  clearExecution,
  addToHistory,
  clearHistory,
} = executionSlice.actions;

export default executionSlice.reducer;