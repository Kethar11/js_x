import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as userService from '../../services/api/userService';
import { updateUserInAuth } from './authSlice';

// Fetch user profile
export const fetchUserProfile = createAsyncThunk(
  'users/fetchUserProfile',
  async (username, { rejectWithValue }) => {
    if (!username) {
      return rejectWithValue('Username is required');
    }
    
    try {
      return await userService.getUserProfile(username);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch user profile');
    }
  }
);

// Follow a user
export const followUser = createAsyncThunk(
  'users/followUser',
  async (userId, { rejectWithValue, dispatch }) => {
    if (!userId) {
      return rejectWithValue('User ID is required');
    }
    
    try {
      const response = await userService.followUser(userId);
      
      // Also update the auth user data since following count changes
      if (response.updatedUser) {
        dispatch(updateUserInAuth(response.updatedUser));
      }
      
      return {
        userId,
        message: response.message,
        updatedProfile: response.updatedProfile
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Could not follow user');
    }
  }
);

// Unfollow a user
export const unfollowUser = createAsyncThunk(
  'users/unfollowUser',
  async (userId, { rejectWithValue, dispatch }) => {
    if (!userId) {
      return rejectWithValue('User ID is required');
    }
    
    try {
      const response = await userService.unfollowUser(userId);
      
      // Also update the auth user data since following count changes
      if (response.updatedUser) {
        dispatch(updateUserInAuth(response.updatedUser));
      }
      
      return {
        userId,
        message: response.message,
        updatedProfile: response.updatedProfile
      };
    } catch (error) {
      return rejectWithValue(error.message || 'Could not unfollow user');
    }
  }
);

// Update user profile
export const updateUserProfile = createAsyncThunk(
  'users/updateUserProfile',
  async ({ userId, profileData }, { rejectWithValue, dispatch }) => {
    if (!userId) {
      return rejectWithValue('User ID is required');
    }
    
    try {
      const updatedUser = await userService.updateUserProfile(userId, profileData);
      
      // Also update auth user data
      dispatch(updateUserInAuth(updatedUser));
      
      return updatedUser;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not update profile');
    }
  }
);

// Get suggested users to follow
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
    if (!query) {
      return rejectWithValue('Search query is required');
    }
    
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
    clearSuggestedUsers: (state) => {
      state.suggestedUsers = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
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
      
      // Follow user
      .addCase(followUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If we have a current profile and it's the one being followed,
        // update its data with the new follower count and followers list
        if (state.currentProfile && (
            state.currentProfile.id === action.payload.userId || 
            state.currentProfile._id === action.payload.userId)) {
          state.currentProfile = {
            ...state.currentProfile,
            ...action.payload.updatedProfile,
            followerCount: (state.currentProfile.followerCount || 0) + 1
          };
        }
        
        // Also update the user in the suggestions list if present
        state.suggestedUsers = state.suggestedUsers.map(user => {
          if (user.id === action.payload.userId || user._id === action.payload.userId) {
            return {
              ...user,
              followerCount: (user.followerCount || 0) + 1,
              // Add indication that the current user is following this user
              isFollowing: true
            };
          }
          return user;
        });
      })
      .addCase(followUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Unfollow user
      .addCase(unfollowUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // If we have a current profile and it's the one being unfollowed,
        // update its data with the new follower count and followers list
        if (state.currentProfile && (
            state.currentProfile.id === action.payload.userId || 
            state.currentProfile._id === action.payload.userId)) {
          state.currentProfile = {
            ...state.currentProfile,
            ...action.payload.updatedProfile,
            followerCount: Math.max((state.currentProfile.followerCount || 1) - 1, 0)
          };
        }
        
        // Also update the user in the suggestions list if present
        state.suggestedUsers = state.suggestedUsers.map(user => {
          if (user.id === action.payload.userId || user._id === action.payload.userId) {
            return {
              ...user,
              followerCount: Math.max((user.followerCount || 1) - 1, 0),
              // Remove indication that the current user is following this user
              isFollowing: false
            };
          }
          return user;
        });
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update user profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProfile = action.payload;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch suggested users
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
      
      // Search users
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

export const { 
  clearUserProfile, 
  clearSuggestedUsers, 
  clearSearchResults,
  clearError 
} = userSlice.actions;

export default userSlice.reducer;