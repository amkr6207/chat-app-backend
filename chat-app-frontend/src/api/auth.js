import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

const axiosInstance = axios.create({
  baseURL: API_BASE,
});

// Register API
export const registerUser = (userData) => axiosInstance.post('/auth/register', userData);

// Login API
export const loginUser = (credentials) => axiosInstance.post('/auth/login', credentials);

export default axiosInstance;
