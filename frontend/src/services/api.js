import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (data) => api.post('/api/auth/register', data),
  login: (data) => api.post('/api/auth/login', data)
};

export const usersAPI = {
  getProfile: (id) => api.get(`/api/users/${id}`),
  updateProfile: (id, data) => api.put(`/api/users/${id}`, data),
  searchUsers: (query) => api.get(`/api/users/search/${query}`)
};

export const messagesAPI = {
  sendMessage: (data) => api.post('/api/messages', data),
  getMessages: (userId, recipientId) => api.get(`/api/messages/${userId}/${recipientId}`),
  deleteMessage: (messageId) => api.delete(`/api/messages/${messageId}`)
};

export const filesAPI = {
  uploadFile: (data) => api.post('/api/files/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  getSharedFiles: (userId) => api.get(`/api/files/shared/${userId}`),
  deleteFile: (fileId) => api.delete(`/api/files/${fileId}`)
};

export const callsAPI = {
  initiateCall: (data) => api.post('/api/calls', data),
  getCallHistory: (userId) => api.get(`/api/calls/history/${userId}`),
  updateCallStatus: (callId, data) => api.put(`/api/calls/${callId}`, data)
};

export default api;
