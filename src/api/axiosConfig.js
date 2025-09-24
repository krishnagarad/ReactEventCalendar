import axios from 'axios';
import { getAuthToken, removeAuthToken } from '../auth/authTokens';

// Create axios instance
const apiClient = axios.create({
  baseURL: process.env.API_BASE_URL || 'https://interview.civicplus.com/4533cde8-2c65-4f79-afc4-0eecafd45927',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor - Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Handle token expiration
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401) {
      // Token expired or invalid
      removeAuthToken();
      
      // Redirect to login or refresh page
      window.location.href = '/';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    // Handle other error responses
    if (error.response?.status === 403) {
      return Promise.reject(new Error('Access forbidden. Insufficient permissions.'));
    }
    
    if (error.response?.status >= 500) {
      return Promise.reject(new Error('Server error. Please try again later.'));
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;