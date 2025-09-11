import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle response errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    signup: (userData) => api.post('/auth/signup', userData),
    verifyToken: (token) => api.get('/auth/verify', {
        headers: { Authorization: `Bearer ${token}` }
    }),
};

// Profile API
export const profileAPI = {
    get: () => api.get('/profile'),
    update: (profileData) => api.put('/profile', profileData),
};

// Opportunities API
export const opportunitiesAPI = {
    getAll: () => api.get('/opportunities'),
    get: (id) => api.get(`/opportunities/${id}`),
    create: (opportunityData) => api.post('/opportunities', opportunityData),
    update: (id, opportunityData) => api.put(`/opportunities/${id}`, opportunityData),
    delete: (id) => api.delete(`/opportunities/${id}`),
    getMyOpportunities: () => api.get('/opportunities/my/opportunities'),
};

// Matching API
export const matchingAPI = {
    getMatches: () => api.get('/match'),
};

export default api;