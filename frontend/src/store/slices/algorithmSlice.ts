import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { algorithmService } from '../../services/algorithmService';

export interface Algorithm {
  id: string;
  name: string;
  category: 'sorting' | 'searching' | 'graph' | 'dynamic-programming' | 'tree';
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  pseudocode: string;
  implementation: string;
  visualizationSupported: boolean;
}

interface AlgorithmState {
  algorithms: Algorithm[];
  selectedAlgorithm: Algorithm | null;
  categories: string[];
  loading: boolean;
  error: string | null;
}

const initialState: AlgorithmState = {
  algorithms: [],
  selectedAlgorithm: null,
  categories: ['sorting', 'searching', 'graph', 'dynamic-programming', 'tree'],
  loading: false,
  error: null,
};

// Async thunks
export const fetchAlgorithms = createAsyncThunk(
  'algorithm/fetchAlgorithms',
  async () => {
    const response = await algorithmService.getAllAlgorithms();
    return response;
  }
);

export const fetchAlgorithmById = createAsyncThunk(
  'algorithm/fetchAlgorithmById',
  async (id: string) => {
    const response = await algorithmService.getAlgorithmById(id);
    return response;
  }
);

export const fetchAlgorithmsByCategory = createAsyncThunk(
  'algorithm/fetchAlgorithmsByCategory',
  async (category: string) => {
    const response = await algorithmService.getAlgorithmsByCategory(category);
    return response;
  }
);

const algorithmSlice = createSlice({
  name: 'algorithm',
  initialState,
  reducers: {
    selectAlgorithm: (state, action: PayloadAction<Algorithm>) => {
      state.selectedAlgorithm = action.payload;
    },
    clearSelectedAlgorithm: (state) => {
      state.selectedAlgorithm = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all algorithms
      .addCase(fetchAlgorithms.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgorithms.fulfilled, (state, action) => {
        state.loading = false;
        state.algorithms = action.payload as any;
      })
      .addCase(fetchAlgorithms.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch algorithms';
      })
      // Fetch algorithm by ID
      .addCase(fetchAlgorithmById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgorithmById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedAlgorithm = action.payload as any;
      })
      .addCase(fetchAlgorithmById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch algorithm';
      })
      // Fetch algorithms by category
      .addCase(fetchAlgorithmsByCategory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlgorithmsByCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.algorithms = action.payload as any;
      })
      .addCase(fetchAlgorithmsByCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch algorithms by category';
      });
  },
});

export const { selectAlgorithm, clearSelectedAlgorithm, setError, clearError } = algorithmSlice.actions;
export default algorithmSlice.reducer;