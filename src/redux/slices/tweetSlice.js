import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Sample data 
const sampleTweets = [
  {
    id: '1',
    content: 'Just setting up my Twitter clone! #FirstTweet',
    createdAt: '2025-03-06T10:23:45Z',
    author: {
      id: '101',
      name: 'John Doe',
      username: 'johndoe',
      profileImage: 'https://via.placeholder.com/50'
    },
    likeCount: 15,
    retweetCount: 5,
    replyCount: 3
  },
  {
    id: '2',
    content: 'This is a Twitter/X clone built with React and Redux Toolkit. Pretty cool! #WebDev #React',
    createdAt: '2025-03-06T09:15:30Z',
    author: {
      id: '102',
      name: 'Jane Smith',
      username: 'janesmith',
      profileImage: 'https://via.placeholder.com/50'
    },
    likeCount: 24,
    retweetCount: 8,
    replyCount: 6
  },
  {
    id: '3',
    content: 'Learning full stack development is challenging but rewarding! #CodingJourney',
    createdAt: '2025-03-05T22:45:12Z',
    author: {
      id: '103',
      name: 'Alex Johnson',
      username: 'alexj',
      profileImage: 'https://via.placeholder.com/50'
    },
    likeCount: 32,
    retweetCount: 12,
    replyCount: 4
  }
];

// This will be replaced with actual API call
export const fetchTweets = createAsyncThunk(
  'tweets/fetchTweets',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate API call with timeout
      await new Promise(resolve => setTimeout(resolve, 500));
      return sampleTweets;
      
      // Later replace with:
      // const response = await tweetService.getTweets();
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Could not fetch tweets');
    }
  }
);

export const createTweet = createAsyncThunk(
  'tweets/createTweet',
  async (tweetData, { rejectWithValue }) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Create a new tweet with mock data
      const newTweet = {
        id: String(Date.now()),
        content: tweetData.content,
        createdAt: new Date().toISOString(),
        author: {
          id: '101',
          name: 'John Doe',
          username: 'johndoe',
          profileImage: 'https://via.placeholder.com/50'
        },
        likeCount: 0,
        retweetCount: 0,
        replyCount: 0
      };
      
      return newTweet;
      
      // Later replace with:
      // const response = await tweetService.createTweet(tweetData);
      // return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Could not create tweet');
    }
  }
);

const tweetSlice = createSlice({
  name: 'tweets',
  initialState: {
    items: [],
    isLoading: false,
    error: null
  },
  reducers: {
    likeTweet: (state, action) => {
      const tweetId = action.payload;
      const tweet = state.items.find(t => t.id === tweetId);
      if (tweet) {
        tweet.likeCount += 1;
      }
    },
    retweetTweet: (state, action) => {
      const tweetId = action.payload;
      const tweet = state.items.find(t => t.id === tweetId);
      if (tweet) {
        tweet.retweetCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
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
      });
  }
});

export const { likeTweet, retweetTweet } = tweetSlice.actions;
export default tweetSlice.reducer;