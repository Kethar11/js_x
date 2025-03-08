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
    
    // Log outgoing requests for debugging
    console.log(`Tweet API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('Tweet API Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`Tweet API Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Log detailed error information for debugging
    console.error('Tweet API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Get tweets by a specific user
export const getUserTweets = async (username) => {
  if (!username) {
    throw new Error('Username is required to fetch tweets');
  }
  
  try {
    // This matches the GET /tweets/user/{username} endpoint from Swagger API
    const response = await apiClient.get(`/user/${username}`);
    return response.data;
  } catch (error) {
    // Handle different error responses
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    
    throw error.response?.data || { message: 'Failed to fetch user tweets' };
  }
};

// Get user reply tweets
export const getUserReplies = async (username) => {
  if (!username) {
    throw new Error('Username is required to fetch replies');
  }
  
  try {
    // This matches the GET /tweets/user/{username}/replies endpoint from Swagger API
    const response = await apiClient.get(`/user/${username}/replies`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    
    throw error.response?.data || { message: 'Failed to fetch user replies' };
  }
};

// Get home timeline tweets
export const getHomeTimeline = async () => {
  try {
    // This matches the GET /tweets/timeline/home endpoint from Swagger API
    const response = await apiClient.get('/timeline/home');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch timeline' };
  }
};

// Get tweet replies
export const getTweetReplies = async (tweetId) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required to fetch replies');
  }
  
  try {
    // This matches the GET /tweets/{id}/replies endpoint from Swagger API
    const response = await apiClient.get(`/${tweetId}/replies`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    }
    
    throw error.response?.data || { message: 'Failed to fetch replies' };
  }
};

// Create a new tweet
export const createTweet = async (tweetData) => {
  try {
    // This matches the POST /tweets endpoint from Swagger API
    const response = await apiClient.post('/', tweetData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to create tweet' };
  }
};

// Like/unlike a tweet
export const likeTweet = async (tweetId) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required');
  }
  
  try {
    // This matches the POST /tweets/{id}/like endpoint from Swagger API
    const response = await apiClient.post(`/${tweetId}/like`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    }
    
    throw error.response?.data || { message: 'Failed to like tweet' };
  }
};

// Retweet/unretweet a tweet
export const retweetTweet = async (tweetId) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required');
  }
  
  try {
    // This matches the POST /tweets/{id}/retweet endpoint from Swagger API
    const response = await apiClient.post(`/${tweetId}/retweet`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    }
    
    throw error.response?.data || { message: 'Failed to retweet' };
  }
};

// Add a comment to a tweet
export const addComment = async (tweetId, content) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required');
  }
  
  try {
    // This matches the POST /tweets/{id}/comment endpoint from Swagger API
    const response = await apiClient.post(`/${tweetId}/comment`, { content });
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    }
    
    throw error.response?.data || { message: 'Failed to add comment' };
  }
};

// Delete a tweet
export const deleteTweet = async (tweetId) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required');
  }
  
  try {
    // This matches the DELETE /tweets/{id} endpoint from Swagger API
    const response = await apiClient.delete(`/${tweetId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    } else if (error.response?.status === 403) {
      throw new Error('You are not authorized to delete this tweet');
    }
    
    throw error.response?.data || { message: 'Failed to delete tweet' };
  }
};

// Search tweets
export const searchTweets = async (query) => {
  if (!query) {
    throw new Error('Search query is required');
  }
  
  try {
    // This matches the GET /tweets/search/tweets endpoint from Swagger API
    const response = await apiClient.get(`/search/tweets?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search tweets' };
  }
};

// Get a single tweet by ID
export const getTweetById = async (tweetId) => {
  if (!tweetId) {
    throw new Error('Tweet ID is required');
  }
  
  try {
    // This matches the GET /tweets/{id} endpoint from Swagger API
    const response = await apiClient.get(`/${tweetId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('Tweet not found');
    }
    
    throw error.response?.data || { message: 'Failed to fetch tweet' };
  }
};