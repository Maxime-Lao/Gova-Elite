import axios from 'axios';
import {jwtDecode} from "jwt-decode";

const API_BASE_URL = 'http://195.35.29.110:8000';

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

const send = async (endpoint, method = 'GET', data = {}, requireAuth = true) => {
    if (requireAuth) {
        const token = localStorage.getItem('token');
        if (token) {
            axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        } else {
            delete axiosInstance.defaults.headers.common['Authorization'];
        }
    }

    try {
        const response = await axiosInstance({
            url: endpoint,
            method,
            data,
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

axiosInstance.interceptors.request.use(async config => {

    if (config.url.includes('/auth')
        || config.url.includes('/api/token/refresh')
        || (config.url.includes('/api/users') && config.method === 'post')
        || (config.url.includes('/forgot_password_send_email') && config.method === 'post')
        || (config.url.includes('/reset_password') && config.method === 'post')
    ) {
        return config;
    }

    const token = localStorage.getItem('token');
    const isValidToken = !isTokenExpired(token);

    if (!isValidToken) {
        const newToken = await refreshToken();
        config.headers['Authorization'] = `Bearer ${newToken}`;
    } else {
        config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
}, error => {
    return Promise.reject(error);
});

function isTokenExpired(token) {
    const decodedToken = jwtDecode(token);
    const expirationDate = new Date(decodedToken.exp * 1000);
    const now = new Date();
    return now > expirationDate;
}

async function refreshToken() {
    try {
        const refresh_token = localStorage.getItem('refresh_token');
        const response = await send('/api/token/refresh ','post', { refresh_token });
        localStorage.setItem('token', response.data.token);
        return response.data.token;
    } catch (error) {
    }
}

export default send;