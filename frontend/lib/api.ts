import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

const apiClient = axios.create({
  baseURL: API_BASE_URL
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    if (typeof window !== "undefined") {
      localStorage.setItem("token", token);
    }
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    if (typeof window !== "undefined") {
      localStorage.removeItem("token");
    }
  }
};

export const loadTokenFromStorage = () => {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem("token");
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  }
  return token;
};

export default apiClient;
