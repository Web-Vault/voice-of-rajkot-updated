import axios from "axios";



// Base URL for the API
const BASE_URL = process.env.REACT_APP_BASE_URL || 'http://localhost:5000';

console.log('Using API Base URL:', BASE_URL);
const API_URL = `${BASE_URL}/api/events`;

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

// Get all events
export const getAllEvents = async () => {
      try {
            const response = await api.get('/');
            console.log("response", response);
            return response.data.events;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch events' };
      }
};

// Get event by ID
export const getEventById = async (id) => {
      try {
            const response = await api.get(`/${id}`);
            console.log("response", response);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch event' };
      }
};

// Get events by performer
export const getEventsByPerformer = async (performerId) => {
      try {
            const response = await api.get(`/performer/${performerId}`);
            console.log("response", response);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to fetch performer events' };
      }
};

// Create a new event
export const createEvent = async (eventData) => {
      try {
            const response = await api.post('/', eventData);
            return response.data;
      } catch (error) {
            throw error.response?.data || { success: false, message: 'Failed to create event' };
      }
};

const eventService = {
      getAllEvents,
      getEventById,
      getEventsByPerformer,
      createEvent
};

export default eventService;