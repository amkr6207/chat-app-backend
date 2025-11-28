import axiosInstance from './auth';

export const fetchUsers = (token) =>
  axiosInstance.get('/auth/users', {
    headers: { Authorization: `Bearer ${token}` },
  });
