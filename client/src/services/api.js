import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5001/api",
    withCredentials: true, // ✅ send cookies
});

export const authAPI = {
    login: (data) => api.post("/auth/login", data),
    signup: (data) => api.post("/auth/signup", data),
    verifyToken: () => api.get("/auth/verify"),
    logout: () => api.post("/auth/logout"),
};
export const profileAPI = axios.create({
    baseURL: "http://localhost:5001/api/profile",
    withCredentials: true,
});