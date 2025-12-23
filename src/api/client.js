import axios from 'axios';

// Base URL for API: use Vite env var in production, otherwise use Vite dev proxy '/api'
axios.defaults.baseURL = import.meta.env.VITE_API_BASE || '/api';

// Attach auth token if present
axios.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch (err) {
    // ignore
  }
  return config;
});

export default axios;
