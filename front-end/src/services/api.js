import axios from 'axios';

// API base URL - backend server
const API_BASE_URL = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Books API
export const booksAPI = {
  // Get all books
  getAll: () => api.get('/books'),
  
  // Get book by ID
  getById: (id) => api.get(`/books/${id}`),
  
  // Create new book
  create: (bookData) => api.post('/books', bookData),
  
  // Update book
  update: (id, bookData) => api.put(`/books/${id}`, bookData),
  
  // Delete book
  delete: (id) => api.delete(`/books/${id}`),
};

// Users API
export const usersAPI = {
  // Get all users
  getAll: () => api.get('/users'),
  
  // Get user by ID
  getById: (id) => api.get(`/users/${id}`),
  
  // Create new user
  create: (userData) => api.post('/users', userData),
  
  // Update user
  update: (id, userData) => api.put(`/users/${id}`, userData),
  
  // Delete user
  delete: (id) => api.delete(`/users/${id}`),
};

// Borrow API
export const borrowAPI = {
  // Borrow a book
  borrow: (borrowData) => api.post('/borrow', borrowData),
  
  // Return a book
  return: (borrowId) => api.put(`/borrow/${borrowId}/return`),
};

// Health check
export const healthCheck = () => api.get('/');

export default api;
