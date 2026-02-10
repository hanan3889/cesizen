import axios from 'axios';

// Configuration de base axios
const api = axios.create({
    baseURL: '/api/v1',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// Intercepteur pour ajouter le token à chaque requête
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Intercepteur pour gérer les erreurs d'authentification
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth
export const authService = {
    register: (data) => api.post('/register', data),
    login: (data) => api.post('/login', data),
    logout: () => axios.post('/logout'),
    me: () => api.get('/me'),
    updateProfile: (data) => api.put('/profile', data),
    changePassword: (data) => api.post('/change-password', data),
};

// Diagnostics
export const diagnosticService = {
    getAll: (page = 1) => api.get(`/diagnostics?page=${page}`),
    getOne: (id) => api.get(`/diagnostics/${id}`),
    create: (data) => api.post('/diagnostics', data),
    delete: (id) => api.delete(`/diagnostics/${id}`),
    getStats: () => api.get('/diagnostics/statistiques'),
    getRecents: () => api.get('/diagnostics/recents'),
};

// Événements de vie
export const evenementService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return api.get(`/evenements?${params}`);
    },
    getOne: (id) => api.get(`/evenements/${id}`),
    search: (query) => api.get(`/evenements/search?q=${query}`),
};

// Pages d'information
export const pageService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return api.get(`/pages?${params}`);
    },
    getOne: (id) => api.get(`/pages/${id}`),
    create: (data) => api.post('/pages', data),
    update: (id, data) => api.put(`/pages/${id}`, data),
    delete: (id) => api.delete(`/pages/${id}`),
    publier: (id) => api.post(`/pages/${id}/publier`),
    archiver: (id) => api.post(`/pages/${id}/archiver`),
};

// Catégories
export const categorieService = {
    getAll: () => api.get('/categories'),
    getOne: (id) => api.get(`/categories/${id}`),
    create: (data) => api.post('/categories', data),
    update: (id, data) => api.put(`/categories/${id}`, data),
    delete: (id) => api.delete(`/categories/${id}`),
};

// Utilisateurs (Admin)
export const userService = {
    getAll: (filters = {}) => {
        const params = new URLSearchParams(filters);
        return api.get(`/users?${params}`);
    },
    getOne: (id) => api.get(`/users/${id}`),
    update: (id, data) => api.put(`/users/${id}`, data),
    delete: (id) => api.delete(`/users/${id}`),
    resetPassword: (id, data) => api.post(`/users/${id}/reset-password`, data),
    getStats: () => api.get('/users/statistiques'),
};

export default api;