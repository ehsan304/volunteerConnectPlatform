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
// export const profileAPI = {
//     getProfile: () => api.get("/profile"),          // GET /api/profile
//     updateProfile: (data) => api.put("/profile", data),  // PUT /api/profile
// };

// Ensure this part exists in your api.js file
export const profileAPI = {
    get: () => api.get('/profile'),
    update: (profileData) => api.put('/profile', profileData),
};