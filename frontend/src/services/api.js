import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach JWT token to requests if stored
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('campuscart_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Products API
export const fetchProducts = async (params = {}) => {
  const response = await api.get('/products', { params });
  return response.data;
};

export const searchProductsApi = async (query) => {
  const response = await api.get(`/products/search?q=${encodeURIComponent(query)}`);
  return response.data;
};

export const fetchProductById = async (id) => {
  const response = await api.get(`/products/${id}`);
  return response.data;
};

export const createProductApi = async (productData) => {
  const response = await api.post('/products', productData);
  return response.data;
};

export const updateProductStatusApi = async (id, status) => {
  const response = await api.patch(`/products/${id}/status`, { status });
  return response.data;
};

export const deleteProductApi = async (id) => {
  const response = await api.delete(`/products/${id}`);
  return response.data;
};

// Categories API
export const fetchCategories = async () => {
  const response = await api.get('/categories');
  return response.data;
};

// Auth API
export const loginApi = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  if (response.data.token) {
    localStorage.setItem('campuscart_token', response.data.token);
  }
  return response.data;
};

export const registerApi = async (userData) => {
  const response = await api.post('/auth/register', userData);
  if (response.data.token) {
    localStorage.setItem('campuscart_token', response.data.token);
  }
  return response.data;
};

export const fetchCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

export const forgotPasswordApi = async (data) => {
  const response = await api.post('/auth/forgotpassword', data);
  return response.data;
};

export const resetPasswordApi = async (data) => {
  const response = await api.post('/auth/resetpassword', data);
  if (response.data.token) {
    localStorage.setItem('campuscart_token', response.data.token);
  }
  return response.data;
};

// Orders API
export const createOrderApi = async (orderData) => {
  const response = await api.post('/orders', orderData);
  return response.data;
};

export const fetchMyOrders = async () => {
  const response = await api.get('/orders/my');
  return response.data;
};

// Student Requirements (Wanted Feed) API
export const fetchRequirementsApi = async () => {
  const response = await api.get('/requirements');
  return response.data;
};

export const createRequirementApi = async (requirementData) => {
  const response = await api.post('/requirements', requirementData);
  return response.data;
};

export const deleteRequirementApi = async (id) => {
  const response = await api.delete(`/requirements/${id}`);
  return response.data;
};

// Campus Events & Digital Tickets API
export const fetchEventsApi = async () => {
  const response = await api.get('/events');
  return response.data;
};

export const createEventApi = async (eventData) => {
  const response = await api.post('/events', eventData);
  return response.data;
};

export const registerForEventApi = async (eventId, bookingData) => {
  const response = await api.post(`/events/${eventId}/register`, bookingData);
  return response.data;
};

export const deleteEventApi = async (eventId) => {
  const response = await api.delete(`/events/${eventId}`);
  return response.data;
};

export default api;


