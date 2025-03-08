import axios from 'axios';

// API base URL - adjust this to match your server URL
const API_URL = 'http://localhost:2000/api/tweets';

// Create axios instance with common configurations
const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token to requests if available
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Get home timeline tweets
export const getHomeTimeline = async () => {
  try {
    const response = await apiClient.get('/timeline/home');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch timeline' };
  }
};

// Get tweets by a specific user
export const getUserTweets = async (username) => {
  try {
    const response = await apiClient.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user tweets' };
  }
};

// Get tweet replies
export const getTweetReplies = async (tweetId) => {
  try {
    const response = await apiClient.get(`/${tweetId}/replies`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch replies' };
  }
};

// Create a new tweet
export const createTweet = async (tweetData) => {
  try {
    const response = await apiClient.post('/', tweetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create tweet' };
  }
};

// Like/unlike a tweet
export const likeTweet = async (tweetId) => {
  try {
    const response = await apiClient.post(`/${tweetId}/like`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to like tweet' };
  }
};

// Retweet/unretweet a tweet
export const retweetTweet = async (tweetId) => {
  try {
    const response = await apiClient.post(`/${tweetId}/retweet`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to retweet' };
  }
};

// Add a comment to a tweet
export const addComment = async (tweetId, content) => {
  try {
    const response = await apiClient.post(`/${tweetId}/comment`, { content });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add comment' };
  }
};

// Delete a tweet
export const deleteTweet = async (tweetId) => {
  try {
    const response = await apiClient.delete(`/${tweetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete tweet' };
  }
};

// Search tweets
export const searchTweets = async (query) => {
  try {
    const response = await apiClient.get(`/search/tweets?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search tweets' };
  }
};

// Get a single tweet by ID
export const getTweetById = async (tweetId) => {
  try {
    const response = await apiClient.get(`/${tweetId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch tweet' };
  }
};