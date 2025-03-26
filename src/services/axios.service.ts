import axios from 'axios'
import { environment } from '@/environments/environment.ts'
import type { LoginResponse } from '@/models/auth/LoginResponse.model.ts'

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: environment.URL, // Your API base URL
})

// Request Interceptor: Add Bearer Token to Authorization Header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken') // Assuming token is stored in localStorage
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

axiosInstance.interceptors.response.use(
  (response) => {
    // If the request was successful, just return the response
    return response;
  },
  async (error) => {
    // Check if the error is an authorization error (401)
    if (error.response && error.response.status === 401) {
      // Optionally, handle the token refresh or logout logic here

      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        try {
          const response = await axios.post<LoginResponse>('/api/auth/refresh', { token: refreshToken });
          localStorage.setItem('accessToken', response.data.token)
          localStorage.setItem('refreshToken', response.data.refreshToken)

          // Retry the original request with the new token
          error.config.headers['Authorization'] = `Bearer ${response.data.token}`;
          return axios(error.config);
        } catch (err) {
          // If refresh fails, log out the user
          console.log(err);
          console.log('Session expired, please log in again.');
          // Handle logout (e.g., redirect to login page)
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
          localStorage.removeItem('user')
          window.location.href = '/login';
        }
      }

      console.log('Token expired. Please log in again.');
      // For example, you can redirect to the login page:
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);


export default axiosInstance
