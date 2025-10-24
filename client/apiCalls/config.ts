import axios from 'axios';

// Use VITE_API_URL in deployed environments; fallback to same-origin /api; dev fallback to localhost
const resolvedBaseURL =
  (typeof import.meta !== 'undefined' && (import.meta as any).env?.VITE_API_URL) ||
  (typeof window !== 'undefined' ? `${window.location.origin.replace(/\/$/, '')}/api` : 'http://localhost:5000/api');

const API = axios.create({
  baseURL: resolvedBaseURL,
});

// Add token to requests if it exists
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
