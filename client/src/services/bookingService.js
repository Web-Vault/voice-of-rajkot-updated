import axios from "axios";

// Base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';
console.log('Using API Base URL:', BASE_URL);


const API_URL = `${BASE_URL}/api/bookings`;

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

// Get user bookings
export const getUserBookings = async () => {
      try {
            const response = await api.get('/user');
            console.log('User Bookings Response:', response.data);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch bookings' };
      }
};

export const getVerifiedUserBookings = async () => {
      try {
            const response = await api.get('/user/verified');
            console.log('Verified User Bookings Response:', response.data);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch verified bookings' };
      }
};

// Get event bookings
export const getEventBookings = async (eventId) => {
      try {
            // Get fresh token from localStorage
            const token = localStorage.getItem('userToken');

            if (!token) {
                  console.error('No authentication token found');
                  window.location.href = '/login';
                  throw new Error('Please log in to continue');
            }

            // Make sure to use the api instance which has the interceptor
            const response = await api.get(`/event/${eventId}`, {
                  headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                  },
                  withCredentials: true
            });

            return response.data;
      } catch (error) {
            console.error('Error in getEventBookings:', error);

            if (error.response) {
                  // The request was made and the server responded with a status code
                  console.error('Response data:', error.response.data);
                  console.error('Response status:', error.response.status);
                  console.error('Response headers:', error.response.headers);

                  if (error.response.status === 403) {
                        // Clear invalid token
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('userInfo');
                        window.location.href = '/login';
                        throw new Error('Your session has expired. Please log in again.');
                  }

                  throw error.response.data || {
                        success: false,
                        message: error.response.statusText || 'Failed to fetch event bookings'
                  };
            } else if (error.request) {
                  // The request was made but no response was received
                  console.error('No response received:', error.request);
                  throw {
                        success: false,
                        message: 'No response from server. Please check your connection.'
                  };
            } else {
                  // Something happened in setting up the request
                  console.error('Request setup error:', error.message);
                  throw {
                        success: false,
                        message: error.message || 'Failed to fetch event bookings'
                  };
            }
      }
};

export const createBooking = async (bookingData) => {
      try {
            const response = await api.post('/', bookingData);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to create booking' };
      }
};

// Upload payment screenshot to Cloudinary
export const uploadPaymentScreenshot = async (file) => {
      try {
            const cloudName = process.env.REACT_APP_CLOUDINARY_CLOUD_NAME || 'dwk4vt9ao';
            const apiKey = process.env.REACT_APP_CLOUDINARY_API_KEY || '783396415861444';

            if (!cloudName) throw new Error('Cloudinary cloud name is not configured');
            if (!apiKey) throw new Error('Cloudinary API key is not configured');

            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'voice_of_rajkot_unsigned'); // Use a preset specifically configured for unsigned uploads
            formData.append('api_key', apiKey);
            formData.append('timestamp', (Date.now() / 1000) | 0);
            formData.append('folder', 'payment_screenshots'); // Optional: organize uploads

            const response = await axios.post(
                  `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
                  formData,
                  {
                        headers: {
                              'Content-Type': 'multipart/form-data',
                              'X-Requested-With': 'XMLHttpRequest'
                        },
                        withCredentials: false
                  }
            );

            if (!response.data || !response.data.public_id) {
                  throw new Error('Invalid response from Cloudinary');
            }

            return {
                  public_id: response.data.public_id,
                  url: response.data.secure_url || response.data.url,
                  format: response.data.format,
                  created_at: response.data.created_at,
                  bytes: response.data.bytes
            };

      } catch (error) {
            console.error('Error uploading to Cloudinary:', {
                  message: error.message,
                  response: error.response?.data,
                  config: error.config
            });

            let errorMessage = 'Failed to upload payment screenshot';
            if (error.response?.data?.error?.message) {
                  errorMessage = error.response.data.error.message;
            } else if (error.message) {
                  errorMessage = error.message;
            }

            throw new Error(errorMessage);
      }
};

// Upload payment screenshot via backend
export const uploadPaymentScreenshotToBackend = async (bookingId, file) => {
      try {
            const formData = new FormData();
            formData.append('paymentScreenshot', file);

            const response = await api.post(`/${bookingId}/upload-payment`, formData, {
                  headers: {
                        'Content-Type': 'multipart/form-data',
                  },
            });

            return response.data;
      } catch (error) {
            console.error('Error uploading payment screenshot:', error);
            throw error;
      }
};

// Verify booking payment (admin)
export const verifyBooking = async (bookingId) => {
      try {
            const response = await api.post(`/${bookingId}/verify`);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to verify booking' };
      }
};

// Reject booking payment (admin) with reason
export const rejectBooking = async (bookingId, reason) => {
      try {
            const response = await api.post(`/${bookingId}/reject`, { reason });
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to reject booking' };
      }
};

const bookingService = {
      getUserBookings,
      getEventBookings,
      createBooking,
      uploadPaymentScreenshot, // Keep the direct Cloudinary upload as backup
      uploadPaymentScreenshotToBackend, // New backend upload method
      verifyBooking,
      rejectBooking
};

export default bookingService;