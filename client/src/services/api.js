import axios from "axios";

const api = axios.create({

    baseURL: import.meta.env.VITE_API_URL || "http://localhost:5001/",
    withCredentials: true,
});

export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    signup: (data) => api.post("/auth/signup", data),
    verifyToken: () => api.get("/auth/verify"),
    logout: () => api.post("/auth/logout"),
};

export const profileAPI = {
    get: () => api.get('/profile'),
    update: (profileData) => api.put('/profile', profileData),
};


export const opportunitiesAPI = {
    getAll: () => api.get('/opportunities'),
    getOne: (id) => api.get(`/opportunities/${id}`),

    getMy: () => api.get('/opportunities/my/opportunities'),
    create: (data) => api.post('/opportunities', data),
    update: (id, data) => api.put(`/opportunities/${id}`, data),
    delete: (id) => api.delete(`/opportunities/${id}`),
};


export const applicationsAPI = {
    apply: (applicationData) => api.post('/applications', applicationData),
    getMyApplications: () => api.get('/applications/my-applications'),
    getOpportunityApplications: (opportunityId) => api.get(`/applications/opportunity/${opportunityId}`),
    updateStatus: (id, status) => api.patch(`/applications/${id}/status`, { status }),
};



export const matchingAPI = {
    getMatches: () => api.get('/match'),
};