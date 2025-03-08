import axios from 'axios';

// API base URL - adjust this to match your server URL
const API_URL = 'http://localhost:5000/api/users';

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

// Get user profile by username
export const getUserProfile = async (username) => {
  try {
    const response = await apiClient.get(`/${username}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  try {
    const response = await apiClient.put(`/${userId}`, profileData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update profile' };
  }
};

// Follow a user
export const followUser = async (userId) => {
  try {
    const response = await apiClient.post(`/${userId}/follow`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to follow user' };
  }
};

// Unfollow a user
export const unfollowUser = async (userId) => {
  try {
    const response = await apiClient.post(`/${userId}/unfollow`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to unfollow user' };
  }
};

// Get suggested users
export const getSuggestedUsers = async () => {
  try {
    const response = await apiClient.get('/suggestions/users');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch suggested users' };
  }
};

// Search users
export const searchUsers = async (query) => {
  try {
    const response = await apiClient.get(`/search/users?q=${encodeURIComponent(query)}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to search users' };
  }
};