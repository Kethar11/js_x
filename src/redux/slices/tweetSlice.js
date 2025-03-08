import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as tweetService from '../../services/api/tweetService';

// Fetch tweets for home timeline
export const fetchTweets = createAsyncThunk(
  'tweets/fetchTweets',
  async (_, { rejectWithValue }) => {
    try {
      return await tweetService.getHomeTimeline();
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch tweets');
    }
  }
);

// Fetch tweets by a specific user
export const fetchUserTweets = createAsyncThunk(
  'tweets/fetchUserTweets',
  async (username, { rejectWithValue }) => {
    try {
      return await tweetService.getUserTweets(username);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch user tweets');
    }
  }
);

// Create a new tweet
export const createTweet = createAsyncThunk(
  'tweets/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      return await tweetService.createTweet(tweetData);
    } catch (error) {
      return rejectWithValue(error.message || 'Could not create tweet');
    }
  }
);

// Like a tweet
export const likeUnlikeTweet = createAsyncThunk(
  'tweets/likeUnlikeTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await tweetService.likeTweet(tweetId);
      return { tweetId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to like/unlike tweet');
    }
  }
);

// Retweet a tweet
export const retweetUnretweet = createAsyncThunk(
  'tweets/retweetUnretweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      const response = await tweetService.retweetTweet(tweetId);
      return { tweetId, message: response.message };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to retweet/unretweet');
    }
  }
);

// Delete a tweet
export const deleteTweet = createAsyncThunk(
  'tweets/deleteTweet',
  async (tweetId, { rejectWithValue }) => {
    try {
      await tweetService.deleteTweet(tweetId);
      return tweetId;
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to delete tweet');
    }
  }
);

// Add a comment to a tweet
export const addComment = createAsyncThunk(
  'tweets/addComment',
  async ({ tweetId, content }, { rejectWithValue }) => {
    try {
      const comment = await tweetService.addComment(tweetId, content);
      return { tweetId, comment };
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to add comment');
    }
  }
);

// Search tweets
export const searchTweets = createAsyncThunk(
  'tweets/searchTweets',
  async (query, { rejectWithValue }) => {
    try {
      return await tweetService.searchTweets(query);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search tweets');
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweets',
  initialState: {
    items: [],
    userTweets: [],
    searchResults: [],
    isLoading: false,
    error: null
  },
  reducers: {
    clearTweets: (state) => {
      state.items = [];
    },
    clearUserTweets: (state) => {
      state.userTweets = [];
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
      // Fetch tweets cases
      .addCase(fetchTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch user tweets cases
      .addCase(fetchUserTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userTweets = action.payload;
      })
      .addCase(fetchUserTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create tweet cases
      .addCase(createTweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Like/Unlike tweet cases
      .addCase(likeUnlikeTweet.fulfilled, (state, action) => {
        const { tweetId, message } = action.payload;
        const tweet = state.items.find(t => t._id === tweetId);
        
        if (tweet) {
          if (message === 'Tweet liked') {
            // If the user just liked the tweet
            if (!tweet.likes.includes(tweet.currentUser)) {
              tweet.likes.push(tweet.currentUser);
            }
          } else {
            // If the user just unliked the tweet
            tweet.likes = tweet.likes.filter(id => id !== tweet.currentUser);
          }
        }
      })
      
      // Retweet/Unretweet cases
      .addCase(retweetUnretweet.fulfilled, (state, action) => {
        const { tweetId, message } = action.payload;
        const tweet = state.items.find(t => t._id === tweetId);
        
        if (tweet) {
          if (message === 'Tweet retweeted') {
            // If the user just retweeted
            if (!tweet.retweets.includes(tweet.currentUser)) {
              tweet.retweets.push(tweet.currentUser);
            }
          } else {
            // If the user just unretweeted
            tweet.retweets = tweet.retweets.filter(id => id !== tweet.currentUser);
          }
        }
      })
      
      // Delete tweet cases
      .addCase(deleteTweet.fulfilled, (state, action) => {
        state.items = state.items.filter(tweet => tweet._id !== action.payload);
        state.userTweets = state.userTweets.filter(tweet => tweet._id !== action.payload);
      })
      
      // Add comment cases
      .addCase(addComment.fulfilled, (state, action) => {
        const { tweetId, comment } = action.payload;
        const tweet = state.items.find(t => t._id === tweetId);
        
        if (tweet) {
          if (!tweet.comments) {
            tweet.comments = [];
          }
          tweet.comments.push(comment);
          tweet.commentCount = (tweet.commentCount || 0) + 1;
        }
      })
      
      // Search tweets cases
      .addCase(searchTweets.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchTweets.fulfilled, (state, action) => {
        state.isLoading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchTweets.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const { clearTweets, clearUserTweets, clearSearchResults, clearError } = tweetSlice.actions;
export default tweetSlice.reducer;