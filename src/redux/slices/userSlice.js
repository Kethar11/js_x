import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/api/userService';

// Get user profile by username
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (username, { rejectWithValue }) => {
    try {
      return await userService.getUserProfile(username);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch user profile');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue }) => {
    try {
      return await userService.updateUserProfile(userId, profileData);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not update profile');
    }
  }
);

// Follow a user
export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.followUser(userId);
      return { userId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Could not follow user');
    }
  }
);

// Unfollow a user
export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await userService.unfollowUser(userId);
      return { userId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Could not unfollow user');
    }
  }
);

// Get suggested users
export const fetchSuggestedUsers = createAsyncThunk(
  'users/fetchSuggestedUsers',
  async (_, { rejectWithValue }) => {
    try {
      return await userService.getSuggestedUsers();
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch suggested users');
    }
  }
);

// Search users
export const searchUsers = createAsyncThunk(
  'users/searchUsers',
  async (query, { rejectWithValue }) => {
    try {
      return await userService.searchUsers(query);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not search users');
    }
  }
);

const userSlice = createSlice({
  name: 'users',
  initialState: {
    currentProfile: null,
    suggestedUsers: [],
    searchResults: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearUserProfile: (state) => {
      state.currentProfile = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile cases
      .addCase(fetchUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile cases
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        // If the current profile is the one being updated, update it in state
        if (state.currentProfile && state.currentProfile.id === action.payload.id) {
          state.currentProfile = action.payload;
        }
      })
      
      // Follow user cases
      .addCase(followUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          // Add the user ID to following list
          if (!state.currentProfile.following) {
            state.currentProfile.following = [];
          }
          state.currentProfile.following.push(action.payload.userId);
          
          // Update follower count
          state.currentProfile.followingCount = 
            (state.currentProfile.followingCount || 0) + 1;
        }
      })
      
      // Unfollow user cases
      .addCase(unfollowUser.fulfilled, (state, action) => {
        if (state.currentProfile) {
          // Remove the user ID from following list
          if (state.currentProfile.following) {
            state.currentProfile.following = 
              state.currentProfile.following.filter(id => id !== action.payload.userId);
          }
          
          // Update follower count
          state.currentProfile.followingCount = 
            Math.max((state.currentProfile.followingCount || 0) - 1, 0);
        }
      })
      
      // Fetch suggested users cases
      .addCase(fetchSuggestedUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSuggestedUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.suggestedUsers = action.payload;
      })
      .addCase(fetchSuggestedUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Search users cases
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearUserProfile, clearSearchResults } = userSlice.actions;
export default userSlice.reducer;