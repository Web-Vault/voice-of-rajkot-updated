import axios from 'axios';


// Base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
console.log('Using API Base URL:', BASE_URL);

const API_URL = `${BASE_URL}/api/posts`;

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

// Get all posts with pagination
export const getAllPosts = async (page = 1, limit = 10) => {
      try {
            const response = await api.get(`/?page=${page}&limit=${limit}`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch posts' };
      }
};

// Get post by ID
export const getPostById = async (id) => {
      try {
            const response = await api.get(`/${id}`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch post' };
      }
};

// Get posts by author
export const getPostsByAuthor = async (authorId) => {
      try {
            const response = await api.get(`/author/${authorId}`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch author posts' };
      }
};

// Like/unlike a post (toggle)
export const togglePostLike = async (postId) => {
      try {
            const response = await api.put(`/${postId}/like`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to toggle post like' };
      }
};

// Get posts by tag
export const getPostsByTag = async (tag, page = 1, limit = 10) => {
      try {
            const response = await api.get(`/tag/${tag}?page=${page}&limit=${limit}`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch posts by tag' };
      }
};

// Create a new post (performers only)
export const createPost = async ({ heading, content, tags, image }) => {
      try {
            const response = await api.post(`/`, { heading, content, tags, image });
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to create post' };
      }
};

const postService = {
      getAllPosts,
      getPostById,
      getPostsByAuthor,
      togglePostLike,
      getPostsByTag,
      createPost
};

export default postService;