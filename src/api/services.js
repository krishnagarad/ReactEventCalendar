import axios from 'axios';
import { apiConfig } from '../apiConfig';
import { getAuthToken, setAuthToken } from '../auth/authTokens';

export const api = axios.create({
  baseURL: apiConfig.baseUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Authentication service
export const authenticate = async () => {
  try {
    const response = await api.post(apiConfig.baseUrl + apiConfig.authUrl, {
      clientId: apiConfig.clientId,
      clientSecret: apiConfig.clientSecret,
    });
    return response.data;
  } catch (error) {
    console.error('Error authenticating:', error);
    throw error;
  }
};

// Request Interceptor - Add token to every request
api.interceptors.request.use(
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
api.interceptors.response.use(
  (response) => {
    if (response && (response.status === 200 || response.status === 201)) {
      return response;
    } else {
      return Promise.reject(new Error('Unexpected response status: ' + response.status));
    }
  },
  (error) => {
    // Handle 401 Unauthorized responses
    if (error.response?.status === 401 || error.response?.status === 400) {
      // Token expired or invalid
      setAuthToken(null);
      
      // Redirect to login or refresh page
      window.location.href = '/';
      
      return Promise.reject(new Error('Session expired. Please login again.'));
    }
    
    return Promise.reject(error);
  }
);

// Fixed fetchEvents function - no token parameter needed since interceptor handles it
export const fetchEvents = async () => {
  try {
    const response = await api.get(apiConfig.baseUrl + apiConfig.eventsUrl);
    // Ensure we return an array, even if the API returns something else
    const data = response.data.items;
    
    // Handle different API response structures
    if (Array.isArray(data)) {
      return data;
    } else if (data && Array.isArray(data.events)) {
      return data.events;
    } else if (data && Array.isArray(data.data)) {
      return data.data;
    } else {
      console.warn('API response is not an array:', data);
      return []; // Return empty array as fallback
    }
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventsWithPagination = async (params = {}) => {
  try {
    const queryParams = new URLSearchParams();
    
    // Add OData parameters
    if (params.$top) queryParams.append('$top', params.$top);
    if (params.$skip) queryParams.append('$skip', params.$skip);
    if (params.$filter) queryParams.append('$filter', params.$filter);
    if (params.$orderBy) queryParams.append('$orderby', params.$orderBy);
    
    const url = `${apiConfig.baseUrl}${apiConfig.eventsUrl}?${queryParams.toString()}`;
    const response = await api.get(url);
    
    // Handle different API response structures
    const data = response.data;
    
    if (data && typeof data === 'object') {
      // If API returns paginated response with metadata
      if (data.items && Array.isArray(data.items)) {
        return {
          data: data.items,
          totalCount: data.total,
          hasNextPage: data.items.length !== data.total
        };
      }
      // If API returns simple object with data array
      else if (data.data && Array.isArray(data.data)) {
        return {
          data: data.data,
          totalCount: data.totalCount || data.total || data.data.length,
          hasNextPage: data.hasNextPage || false
        };
      }
      // If API returns direct array
      else if (Array.isArray(data)) {
        return {
          data: data,
          totalCount: data.length,
          hasNextPage: false
        };
      }
    }
    
    // Fallback
    return {
      data: [],
      totalCount: 0,
      hasNextPage: false
    };
  } catch (error) {
    console.error('Error fetching events with pagination:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const response = await api.post(apiConfig.baseUrl + apiConfig.eventsUrl, eventData);
    return response.data;
  } catch (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }
};

