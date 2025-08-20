import axios from 'axios';


// Base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
console.log('Using API Base URL:', BASE_URL);

const API_URL = `${BASE_URL}/api/auth`;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add auth token interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Get logged-in user's profile
export const getUserProfile = async () => {
  try {
    const response = await api.get('/profile');
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch profile' };
  }
};

// Get any user's profile by ID (public)
export const getArtistProfile = async (userId) => {
  try {
    const response = await api.get(`/users/${userId}`);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch artist profile' };
  }
};

// Update user profile
export const updateUserProfile = async (userData) => {
  try {
    const response = await api.put('/profile', userData);
    return response.data.user;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to update profile' };
  }
};

// Get all performers
export const getAllPerformers = async () => {
  try {
    const response = await api.get('/performers');
    return response.data.performers;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch performers' };
  }
};

// Get all users (admin only)
export const getAllUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data.users;
  } catch (error) {
    throw error.response?.data || { success: false, message: 'Failed to fetch users' };
  }
};

const userService = {
  getUserProfile,
  getArtistProfile,
  updateUserProfile,
  getAllPerformers,
  getAllUsers
};

export default userService;