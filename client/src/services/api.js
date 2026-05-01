import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5001/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// --- Request Interceptor ---
// Automatically attaches the JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // Or your preferred storage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// --- Response Interceptor ---
// Centralized error handling (e.g., 401 Unauth, 500 Server Error)
api.interceptors.response.use(
  (response) => response, 
  (error) => {
    const status = error.response ? error.response.status : null;

    if (status === 401) {
      // Logic for unauthorized access (e.g., redirect to login, clear storage)
      console.error("Unauthorized! Logging out...");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Use proper navigation instead of full page reload
      if (window.location.pathname !== "/login" && window.location.pathname !== "/register") {
        window.location.href = "/login";
      }
    } else if (status === 404) {
      console.error("Resource not found.");
    } else {
      console.error("An unexpected error occurred:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;