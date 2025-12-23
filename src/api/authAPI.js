import axios from 'axios';

// Add a request interceptor to attach the token
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const API_BASE = '/api/auth';

export const authAPI = {
  login: async (email, password) => {
    const response = await axios.post(`${API_BASE}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  register: async (name, email, password, role) => {
    const response = await axios.post(`${API_BASE}/register`, { name, email, password, role });
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response;
  },

  logout: async () => {
    localStorage.removeItem('token');
    return { data: { success: true } };
  },

  getCurrentUser: async () => {
    return axios.get(`${API_BASE}/me`);
  },

  updateProfile: async ({ name, avatarFile }) => {
    const formData = new FormData();
    if (name) formData.append('name', name);
    if (avatarFile) formData.append('avatar', avatarFile);

    return axios.patch(`${API_BASE}/me`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};
