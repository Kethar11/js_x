import axios from 'axios';

// API base URL - adjust this to match your server URL
const API_URL = 'http://localhost:2000/api/auth';

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

// Login user
export const login = async (username, password) => {
  try {
    const response = await apiClient.post('/login', { username, password });
    
    // Store token in localStorage for persistent auth
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Register new user
export const register = async (username, email, password) => {
  try {
    const response = await apiClient.post('/register', { 
      username, 
      email, 
      password 
    });
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Get current user profile
export const getCurrentUser = async () => {
  try {
    const response = await apiClient.get('/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Network error' };
  }
};

// Logout user
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get stored auth data
export const getStoredAuth = () => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));
  
  return token && user ? { token, user } : null;
};