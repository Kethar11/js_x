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
    if (!username) {
      return rejectWithValue('Username is required to fetch tweets');
    }
    
    try {
      const tweets = await tweetService.getUserTweets(username);
      return tweets;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch user tweets');
    }
  }
);

// Fetch user replies
export const fetchUserReplies = createAsyncThunk(
  'tweets/fetchUserReplies',
  async (username, { rejectWithValue }) => {
    if (!username) {
      return rejectWithValue('Username is required to fetch replies');
    }
    
    try {
      const replies = await tweetService.getUserReplies(username);
      return replies;
    } catch (error) {
      return rejectWithValue(error.message || 'Could not fetch user replies');
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
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
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
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
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
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
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
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
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
    if (!query) {
      return rejectWithValue('Search query is required');
    }
    
    try {
      return await tweetService.searchTweets(query);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to search tweets');
    }
  }
);

// Get tweet by ID
export const fetchTweetById = createAsyncThunk(
  'tweets/fetchTweetById',
  async (tweetId, { rejectWithValue }) => {
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
    try {
      return await tweetService.getTweetById(tweetId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch tweet');
    }
  }
);

// Get tweet replies
export const fetchTweetReplies = createAsyncThunk(
  'tweets/fetchTweetReplies',
  async (tweetId, { rejectWithValue }) => {
    if (!tweetId) {
      return rejectWithValue('Tweet ID is required');
    }
    
    try {
      return await tweetService.getTweetReplies(tweetId);
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch replies');
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweets',
  initialState: {
    items: [],         // Home timeline tweets
    userTweets: [],    // User profile tweets
    userReplies: [],   // User profile replies
    searchResults: [], // Search results
    currentTweet: null, // Single tweet view
    tweetReplies: [],  // Replies to a specific tweet
    isLoading: false,
    error: null
  },
  reducers: {
    clearTweets: (state) => {
      state.items = [];
    },
    clearUserTweets: (state) => {
      state.userTweets = [];
      state.userReplies = [];
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
    clearCurrentTweet: (state) => {
      state.currentTweet = null;
      state.tweetReplies = [];
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch home timeline tweets
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
      
      // Fetch user tweets
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
      
      // Fetch user replies
      .addCase(fetchUserReplies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserReplies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userReplies = action.payload;
      })
      .addCase(fetchUserReplies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tweet by ID
      .addCase(fetchTweetById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTweetById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentTweet = action.payload;
      })
      .addCase(fetchTweetById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Fetch tweet replies
      .addCase(fetchTweetReplies.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTweetReplies.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tweetReplies = action.payload;
      })
      .addCase(fetchTweetReplies.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Create tweet
      .addCase(createTweet.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createTweet.fulfilled, (state, action) => {
        state.isLoading = false;
        // Add to home timeline
        state.items.unshift(action.payload);
        
        // Add to user tweets if it's a normal tweet
        if (!action.payload.inReplyToTweetId) {
          // Also add to user tweets if it belongs to the current user
          const userInTweet = action.payload.user;
          const userInUserTweets = state.userTweets[0]?.user;
          
          if (userInTweet && userInUserTweets && 
              (userInTweet.id === userInUserTweets.id || 
               userInTweet._id === userInUserTweets._id)) {
            state.userTweets.unshift(action.payload);
          }
        } else {
          // This is a reply, add to user replies
          const userInTweet = action.payload.user;
          const userInUserReplies = state.userReplies[0]?.user;
          
          if (userInTweet && userInUserReplies && 
              (userInTweet.id === userInUserReplies.id || 
               userInTweet._id === userInUserReplies._id)) {
            state.userReplies.unshift(action.payload);
          }
          
          // If this is a reply to the current tweet, add to tweet replies
          if (state.currentTweet && 
              (action.payload.inReplyToTweetId === state.currentTweet.id || 
               action.payload.inReplyToTweetId === state.currentTweet._id)) {
            state.tweetReplies.unshift(action.payload);
            
            // Update reply count on current tweet
            state.currentTweet.commentCount = (state.currentTweet.commentCount || 0) + 1;
          }
        }
      })
      .addCase(createTweet.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Like/Unlike tweet
      .addCase(likeUnlikeTweet.fulfilled, (state, action) => {
        const { tweetId, message } = action.payload;
        
        // Update in all possible tweet lists
        const updateTweetLikes = (tweetList, userId, isLiked) => {
          return tweetList.map(tweet => {
            if (tweet._id === tweetId || tweet.id === tweetId) {
              // Create a new likes array
              let newLikes = [...(tweet.likes || [])];
              
              if (isLiked) {
                // Add user to likes if not already there
                if (!newLikes.includes(userId)) {
                  newLikes.push(userId);
                }
              } else {
                // Remove user from likes
                newLikes = newLikes.filter(id => id !== userId);
              }
              
              // Return updated tweet
              return {
                ...tweet,
                likes: newLikes,
                likeCount: newLikes.length
              };
            }
            return tweet;
          });
        };
        
        // Get current user ID from possible locations
        const userId = state.items[0]?.currentUser || 
                       (state.items[0]?.user && state.items[0].user.id) ||
                       (state.currentTweet?.user && state.currentTweet.user.id);
        
        if (userId) {
          const isLiked = message === 'Tweet liked';
          
          // Update all tweet lists
          state.items = updateTweetLikes(state.items, userId, isLiked);
          state.userTweets = updateTweetLikes(state.userTweets, userId, isLiked);
          state.userReplies = updateTweetLikes(state.userReplies, userId, isLiked);
          state.searchResults = updateTweetLikes(state.searchResults, userId, isLiked);
          state.tweetReplies = updateTweetLikes(state.tweetReplies, userId, isLiked);
          
          // Update current tweet if it matches
          if (state.currentTweet && 
              (state.currentTweet.id === tweetId || state.currentTweet._id === tweetId)) {
            let newLikes = [...(state.currentTweet.likes || [])];
            
            if (isLiked) {
              if (!newLikes.includes(userId)) {
                newLikes.push(userId);
              }
            } else {
              newLikes = newLikes.filter(id => id !== userId);
            }
            
            state.currentTweet = {
              ...state.currentTweet,
              likes: newLikes,
              likeCount: newLikes.length
            };
          }
        }
      })
      
      // Retweet/Unretweet cases
      .addCase(retweetUnretweet.fulfilled, (state, action) => {
        const { tweetId, message } = action.payload;
        
        // Update in all possible tweet lists
        const updateTweetRetweets = (tweetList, userId, isRetweeted) => {
          return tweetList.map(tweet => {
            if (tweet._id === tweetId || tweet.id === tweetId) {
              // Create a new retweets array
              let newRetweets = [...(tweet.retweets || [])];
              
              if (isRetweeted) {
                // Add user to retweets if not already there
                if (!newRetweets.includes(userId)) {
                  newRetweets.push(userId);
                }
              } else {
                // Remove user from retweets
                newRetweets = newRetweets.filter(id => id !== userId);
              }
              
              // Return updated tweet
              return {
                ...tweet,
                retweets: newRetweets,
                retweetCount: newRetweets.length
              };
            }
            return tweet;
          });
        };
        
        // Get current user ID from possible locations
        const userId = state.items[0]?.currentUser || 
                       (state.items[0]?.user && state.items[0].user.id) ||
                       (state.currentTweet?.user && state.currentTweet.user.id);
        
        if (userId) {
          const isRetweeted = message === 'Tweet retweeted';
          
          // Update all tweet lists
          state.items = updateTweetRetweets(state.items, userId, isRetweeted);
          state.userTweets = updateTweetRetweets(state.userTweets, userId, isRetweeted);
          state.userReplies = updateTweetRetweets(state.userReplies, userId, isRetweeted);
          state.searchResults = updateTweetRetweets(state.searchResults, userId, isRetweeted);
          state.tweetReplies = updateTweetRetweets(state.tweetReplies, userId, isRetweeted);
          
          // Update current tweet if it matches
          if (state.currentTweet && 
              (state.currentTweet.id === tweetId || state.currentTweet._id === tweetId)) {
            let newRetweets = [...(state.currentTweet.retweets || [])];
            
            if (isRetweeted) {
              if (!newRetweets.includes(userId)) {
                newRetweets.push(userId);
              }
            } else {
              newRetweets = newRetweets.filter(id => id !== userId);
            }
            
            state.currentTweet = {
              ...state.currentTweet,
              retweets: newRetweets,
              retweetCount: newRetweets.length
            };
          }
        }
      })
      
      // Delete tweet cases
      .addCase(deleteTweet.fulfilled, (state, action) => {
        const deletedTweetId = action.payload;
        
        // Remove from all tweet lists
        state.items = state.items.filter(tweet => 
          tweet._id !== deletedTweetId && tweet.id !== deletedTweetId
        );
        
        state.userTweets = state.userTweets.filter(tweet => 
          tweet._id !== deletedTweetId && tweet.id !== deletedTweetId
        );
        
        state.userReplies = state.userReplies.filter(tweet => 
          tweet._id !== deletedTweetId && tweet.id !== deletedTweetId
        );
        
        state.searchResults = state.searchResults.filter(tweet => 
          tweet._id !== deletedTweetId && tweet.id !== deletedTweetId
        );
        
        state.tweetReplies = state.tweetReplies.filter(tweet => 
          tweet._id !== deletedTweetId && tweet.id !== deletedTweetId
        );
        
        // Clear current tweet if it was deleted
        if (state.currentTweet && 
            (state.currentTweet.id === deletedTweetId || state.currentTweet._id === deletedTweetId)) {
          state.currentTweet = null;
        }
      })
      
      // Add comment cases
      .addCase(addComment.fulfilled, (state, action) => {
        const { tweetId, comment } = action.payload;
        
        // Helper function to update comments in a tweet list
        const updateTweetComments = (tweetList) => {
          return tweetList.map(tweet => {
            if (tweet._id === tweetId || tweet.id === tweetId) {
              // Create or update comments array
              const comments = tweet.comments ? [...tweet.comments, comment] : [comment];
              
              // Return updated tweet
              return {
                ...tweet,
                comments,
                commentCount: (tweet.commentCount || 0) + 1
              };
            }
            return tweet;
          });
        };
        
        // Update all tweet lists
        state.items = updateTweetComments(state.items);
        state.userTweets = updateTweetComments(state.userTweets);
        state.userReplies = updateTweetComments(state.userReplies);
        state.searchResults = updateTweetComments(state.searchResults);
        
        // Update current tweet if it matches
        if (state.currentTweet && 
            (state.currentTweet.id === tweetId || state.currentTweet._id === tweetId)) {
          const comments = state.currentTweet.comments ? 
                          [...state.currentTweet.comments, comment] : 
                          [comment];
          
          state.currentTweet = {
            ...state.currentTweet,
            comments,
            commentCount: (state.currentTweet.commentCount || 0) + 1
          };
          
          // Also add to tweet replies if available
          state.tweetReplies.unshift(comment);
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

export const { 
  clearTweets, 
  clearUserTweets, 
  clearSearchResults, 
  clearCurrentTweet,
  clearError 
} = tweetSlice.actions;

export default tweetSlice.reducer;