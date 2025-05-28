import axios from 'axios';

export const axiosInstance = axios.create({
  baseURL: 'https://busbackend-y1x0.onrender.com/api', // Set base URL for your backend
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`,
  },
});
 