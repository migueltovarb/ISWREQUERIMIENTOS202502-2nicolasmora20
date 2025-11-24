import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to attach the token
api.interceptors.request.use(
    (config) => {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.access) {
            config.headers.Authorization = `Bearer ${user.access}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Unwrap paginated responses (DRF) to arrays automatically
api.interceptors.response.use(
    (response) => {
        const data = response.data;
        if (data && typeof data === 'object' && 'results' in data && Array.isArray(data.results)) {
            response.data = data.results;
        }
        return response;
    },
    (error) => Promise.reject(error)
);

export default api;
