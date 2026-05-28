import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 seconds timeout
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Interceptor for handling global errors (like auth, request timeouts)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API error response:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);
