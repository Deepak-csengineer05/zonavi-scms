import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Add auth token to requests
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Handle response errors
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

// Auth API
export const authAPI = {
    register: (data) => api.post('/auth/register', data),
    login: (data) => api.post('/auth/login', data),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (data) => api.put('/auth/profile', data),
    forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
    resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
    verifyEmail: (token) => api.get(`/auth/verify-email/${token}`)
};

// Dashboard API
export const dashboardAPI = {
    getStats: () => api.get('/dashboard/stats')
};

// Projects API
export const projectsAPI = {
    getAll: () => api.get('/projects'),
    getOne: (id) => api.get(`/projects/${id}`),
    create: (data) => api.post('/projects', data),
    update: (id, data) => api.put(`/projects/${id}`, data),
    delete: (id) => api.delete(`/projects/${id}`)
};

// Internships API
export const internshipsAPI = {
    getAll: () => api.get('/internships'),
    getOne: (id) => api.get(`/internships/${id}`),
    create: (data) => api.post('/internships', data),
    update: (id, data) => api.put(`/internships/${id}`, data),
    delete: (id) => api.delete(`/internships/${id}`)
};

// Jobs API
export const jobsAPI = {
    getAll: () => api.get('/jobs'),
    getOne: (id) => api.get(`/jobs/${id}`),
    create: (data) => api.post('/jobs', data),
    update: (id, data) => api.put(`/jobs/${id}`, data),
    delete: (id) => api.delete(`/jobs/${id}`)
};

// Skills API
export const skillsAPI = {
    getAll: () => api.get('/skills'),
    create: (data) => api.post('/skills', data),
    update: (id, data) => api.put(`/skills/${id}`, data),
    delete: (id) => api.delete(`/skills/${id}`)
};

// Certificates API
export const certificatesAPI = {
    getAll: () => api.get('/certificates'),
    getOne: (id) => api.get(`/certificates/${id}`),
    create: (data) => api.post('/certificates', data),
    update: (id, data) => api.put(`/certificates/${id}`, data),
    delete: (id) => api.delete(`/certificates/${id}`)
};

// Admin API
export const adminAPI = {
    getStats: () => api.get('/admin/stats'),
    getStudents: (params) => api.get('/admin/students', { params }),
    getStudent: (id) => api.get(`/admin/students/${id}`),
    deleteStudent: (id) => api.delete(`/admin/students/${id}`),
    getRankings: (params) => api.get('/admin/rankings', { params }),
    importStudents: (data) => api.post('/admin/import', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }),
    exportStudents: () => api.get('/admin/export', { responseType: 'blob' })
};

// Announcement API
export const announcementsAPI = {
    getAll: () => api.get('/announcements'),
    create: (data) => api.post('/announcements', data),
    delete: (id) => api.delete(`/announcements/${id}`)
};

// Community API
export const communityAPI = {
    getAll: (params) => api.get('/community', { params })
};

// Job Postings API
export const jobPostingsAPI = {
    create: (data) => api.post('/admin/jobs', data),
    getAll: (params) => api.get('/jobs/available', { params }),
    delete: (id) => api.delete(`/admin/jobs/${id}`)
};

// Employer API
export const employerAPI = {
    register: (data) => api.post('/employer/register', data),
    getProfile: () => api.get('/employer/profile'),
    updateProfile: (data) => api.put('/employer/profile', data),
    createJob: (data) => api.post('/employer/jobs', data),
    getJobs: () => api.get('/employer/jobs'),
    updateJob: (id, data) => api.put(`/employer/jobs/${id}`, data),
    deleteJob: (id) => api.delete(`/employer/jobs/${id}`),
    getApplicants: (jobId) => api.get(`/employer/jobs/${jobId}/applicants`),
    updateApplicationStatus: (appId, status) => api.put(`/employer/applications/${appId}/status`, { status }),
    getAnalytics: () => api.get('/employer/analytics')
};

// Application API (for students)
export const applicationAPI = {
    apply: (data) => api.post('/applications', data),
    getMyApplications: () => api.get('/applications/my'),
    getApplicationById: (id) => api.get(`/applications/${id}`),
    checkApplication: (jobId) => api.get(`/applications/check/${jobId}`)
};

export default api;
