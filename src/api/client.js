// src/api/client.js
import axios from 'axios';
import { toast } from 'react-toastify';

// Get API URL from environment
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
export const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  timeout: 30000,
  withCredentials: true,
});

// Request interceptor - Add token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Log requests in development
    if (import.meta.env.DEV) {
      console.log('📤 API Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
    }
    
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
apiClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log('📥 API Response:', {
        status: response.status,
        data: response.data,
      });
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Handle network errors
    if (error.code === 'ERR_NETWORK' || error.message === 'Network Error') {
      toast.error('Cannot connect to server. Please check your connection.');
      return Promise.reject(error);
    }
    
    // Handle 401 Unauthorized - Token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshResponse = await apiClient.post('/auth/refresh');
        const { token } = refreshResponse.data;
        
        localStorage.setItem('token', token);
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed - logout
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    // Handle 403 Forbidden
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    }
    
    // Handle 404 Not Found
    if (error.response?.status === 404) {
      toast.error('Resource not found.');
    }
    
    // Handle 429 Rate Limiting
    if (error.response?.status === 429) {
      toast.warning('Too many requests. Please wait a moment.');
    }
    
    // Handle 500 Server Error
    if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    }
    
    // Log errors
    console.error('API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    
    return Promise.reject(error);
  }
);

export default apiClient;