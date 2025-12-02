import axios, { AxiosInstance, AxiosError } from 'axios';
// import { message } from 'antd';

/**
 * Base API URL
 */
const API_BASE_URL = import.meta.env.VITE_API_URL;
/**
 * Create Axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

/**
 * Request interceptor
 */
apiClient.interceptors.request.use(
    (config) => {
        // Add JWT token to Authorization header if available
        const token = localStorage.getItem('auth_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle errors globally
        if (error.response) {
            const status = error.response.status;

            // Handle unauthorized or forbidden access
            if (status === 401 || status === 403) {
                // Clear token
                localStorage.removeItem('auth_token');
                localStorage.removeItem('user');

                // Redirect to login page
                window.location.href = '/login';
                return Promise.reject(error);
            }

            // const data: any = error.response.data;
            // switch (status) {
            //     case 400:
            //         message.error(data.message || 'Invalid request');
            //         break;
            //     case 404:
            //         message.error(data.message || 'Resource not found');
            //         break;
            //     case 500:
            //         message.error('Internal server error. Please try again later.');
            //         break;
            //     default:
            //         message.error('An unexpected error occurred');
            // }
        }
        // else if (error.request) {
        //     message.error('No response from server. Please check your connection.');
        // } else {
        //     message.error('Request failed. Please try again.');
        // }

        return Promise.reject(error);
    }
);

export default apiClient;
