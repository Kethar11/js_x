import axios from 'axios';

// API base URL - adjust this to match your server URL
const API_URL = 'http://localhost:2000/api/users';

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
    
    console.log(`User API Request: ${config.method.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('User API Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
apiClient.interceptors.response.use(
  (response) => {
    console.log(`User API Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    console.error('User API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

// Get user profile by username
export const getUserProfile = async (username) => {
  if (!username) {
    throw new Error('Username is required');
  }
  
  try {
    // This matches the GET /users/{username} endpoint from Swagger API
    const response = await apiClient.get(`/${username}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    }
    
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Follow a user
export const followUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // This matches the POST /users/{id}/follow endpoint from Swagger API
    const response = await apiClient.post(`/${userId}/follow`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    } else if (error.response?.status === 400) {
      throw new Error('Already following this user or attempting to follow yourself');
    }
    
    throw error.response?.data || { message: 'Failed to follow user' };
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // This matches the POST /users/{id}/unfollow endpoint from Swagger API
    const response = await apiClient.post(`/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    } else if (error.response?.status === 400) {
      throw new Error('Not following this user or attempting to unfollow yourself');
    }
    
    throw error.response?.data || { message: 'Failed to unfollow user' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  if (!userId) {
    throw new Error('User ID is required');
  }
  
  try {
    // This matches the PUT /users/{id} endpoint from Swagger API
    const response = await apiClient.put(`/${userId}`, profileData);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error('User not found');
    } else if (error.response?.status === 403) {
      throw new Error('Not authorized to update this profile');
    }
    
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Get suggested users to follow
export const getSuggestedUsers = async () => {
  try {
    // This matches the GET /users/suggestions/users endpoint from Swagger API
    const response = await apiClient.get('/suggestions/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch suggested users' };
  }
};

// Search for users
export const searchUsers = async (query) => {
  if (!query) {
    throw new Error('Search query is required');
  }
  
  try {
    // This matches the GET /users/search/users endpoint from Swagger API
    const response = await apiClient.get(`/search/users?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search users' };
  }
};