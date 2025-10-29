import axios from 'axios';

// Base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
console.log('Using API Base URL:', BASE_URL);

const API_URL = `${BASE_URL}/api/auth`;

// Create axios instance with base URL
const api = axios.create({
      baseURL: API_URL,
      headers: {
            'Content-Type': 'application/json'
      }
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
      (config) => {
            const token = localStorage.getItem('userToken');
            if (token) {
                  config.headers['Authorization'] = `Bearer ${token}`;
            }
            return config;
      },
      (error) => {
            return Promise.reject(error);
      }
);

// Register a new user
export const register = async (userData) => {
      try {
            const response = await api.post('/register', userData);
            if (response.data.success) {
                  // Store user data in localStorage
                  localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                  localStorage.setItem('userToken', response.data.user.token);
            }
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'An error occurred during registration' };
      }
};

// Login user
export const login = async (email, password) => {
      try {
            const response = await api.post('/login', { email, password });
            if (response.data.success) {
                  // Store user data in localStorage
                  console.log(response.data.user);
                  localStorage.setItem('userInfo', JSON.stringify(response.data.user));
                  localStorage.setItem('userToken', response.data.user.token);
            }
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'An error occurred during login' };
      }
};

// Get user profile
export const getUserProfile = async () => {
      try {
            const response = await api.get('/profile');
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch user profile' };
      }
};

// Logout user
export const logout = () => {
      localStorage.removeItem('userInfo');
      localStorage.removeItem('userToken');
};

// Check if user is logged in
export const isAuthenticated = () => {
      return localStorage.getItem('userToken') !== null;
};

// Get current user info
export const getCurrentUser = () => {
      const userInfo = localStorage.getItem('userInfo');
      return userInfo ? JSON.parse(userInfo) : null;
};

const authService = {
      register,
      login,
      logout,
      getUserProfile,
      isAuthenticated,
      getCurrentUser
};

export default authService;