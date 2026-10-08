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

export const acceptOrderApi = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/accept`);
  return response.data;
};

export const rejectOrderApi = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/reject`);
  return response.data;
};

export const completeOrderApi = async (orderId) => {
  const response = await api.patch(`/orders/${orderId}/complete`);
  return response.data;
};

// Chats & Real-time Messages API
export const getOrCreateChatApi = async (recipientId, productId) => {
  const response = await api.post('/chats', { recipientId, productId });
  return response.data;
};

export const fetchUserChatsApi = async () => {
  const response = await api.get('/chats');
  return response.data;
};

export const fetchChatMessagesApi = async (chatId) => {
  const response = await api.get(`/chats/${chatId}/messages`);
  return response.data;
};

export const sendMessageApi = async (chatId, text) => {
  const response = await api.post(`/chats/${chatId}/messages`, { text });
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

// Notifications API
export const fetchNotificationsApi = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markAllNotificationsReadApi = async () => {
  const response = await api.patch('/notifications/read-all');
  return response.data;
};

export const markNotificationReadApi = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

// Admin Command Center API
export const fetchAdminStatsApi = async () => {
  const response = await api.get('/admin/stats');
  return response.data;
};

export const fetchAdminUsersApi = async () => {
  const response = await api.get('/admin/users');
  return response.data;
};

export const toggleUserSuspendApi = async (userId) => {
  const response = await api.patch(`/admin/users/${userId}/suspend`);
  return response.data;
};

export const adminDeleteProductApi = async (productId) => {
  const response = await api.delete(`/admin/products/${productId}`);
  return response.data;
};

export const fetchAdminReportsApi = async () => {
  const response = await api.get('/admin/reports');
  return response.data;
};

export const resolveAdminReportApi = async (reportId, status = 'resolved') => {
  const response = await api.patch(`/admin/reports/${reportId}/resolve`, { status });
  return response.data;
};

// Safety & Abuse Reports API
export const createReportApi = async (reportData) => {
  const response = await api.post('/reports', reportData);
  return response.data;
};

// File & Image Upload API
export const uploadImageApi = async (file) => {
  const formData = new FormData();
  formData.append('image', file);
  const response = await api.post('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return response.data;
};

export default api;


