import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as authService from '../../services/api/authService';

// Async thunks for authentication
export const loginUser = createAsyncThunk(
  'auth/login',
  async ({ username, password }, { rejectWithValue }) => {
    try {
      return await authService.login(username, password);
    } catch (error) {
      return rejectWithValue(error.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async ({ username, email, password }, { rejectWithValue }) => {
    try {
      return await authService.register(username, email, password);
    } catch (error) {
      return rejectWithValue(error.message || 'Registration failed');
    }
  }
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getCurrentUser();
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch user data');
    }
  }
);

// Get initial state from local storage if available
const storedAuth = authService.getStoredAuth();

const initialState = {
  user: storedAuth?.user || null,
  token: storedAuth?.token || null,
  refreshToken: storedAuth?.refreshToken || null,
  loading: false,
  error: null,
  isAuthenticated: !!storedAuth,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      authService.logout();
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Update user after profile update
    updateUserInAuth: (state, action) => {
      if (state.user) {
        // Check if the updated user is the current authenticated user
        const updatedUserId = action.payload.id || action.payload._id;
        const currentUserId = state.user.id || state.user._id;
        
        if (updatedUserId === currentUserId) {
          state.user = {
            ...state.user,
            ...action.payload
          };
          
          // Update in localStorage as well
          if (state.token) {
            localStorage.setItem('user', JSON.stringify(state.user));
          }
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })
      
      // Register cases
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state) => {
        state.loading = false;
        // We don't log the user in automatically after registration
        // They need to go to login page
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch current user cases
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        
        // Update user in localStorage
        localStorage.setItem('user', JSON.stringify(action.payload));
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        // If fetching user fails, clear auth state
        state.user = null;
        state.token = null;
        state.refreshToken = null;
        authService.logout();
      });
  },
});

export const { logout, clearError, updateUserInAuth } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;
export const selectToken = (state) => state.auth.token;

export default authSlice.reducer;