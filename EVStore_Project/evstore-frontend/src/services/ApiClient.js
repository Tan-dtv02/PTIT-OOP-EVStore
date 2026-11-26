// src/services/ApiClient.js
import axios from "axios";

export const ACCESS_KEY = "accessToken";
export const REFRESH_KEY = "refreshToken";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

function getToken(key) {
  return localStorage.getItem(key) || sessionStorage.getItem(key);
}

const ApiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

/* 🟢 Gắn access token vào request */
ApiClient.interceptors.request.use((config) => {
  const token = getToken(ACCESS_KEY);
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/* 🔁 Tự refresh token khi 401 */
ApiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const originalRequest = err.config;

    if (err.response?.status === 401 && !originalRequest._retry) {
      const refreshToken = localStorage.getItem(REFRESH_KEY);
      if (!refreshToken) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      originalRequest._retry = true;

      try {
        const resRefresh = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });

        const newAccess = resRefresh.data.accessToken;
        localStorage.setItem(ACCESS_KEY, newAccess);

        originalRequest.headers.Authorization = `Bearer ${newAccess}`;
        return ApiClient(originalRequest);
      } catch (e) {
        console.error("❌ Refresh thất bại");
        localStorage.clear();
        window.location.href = "/login";
      }
    }

    return Promise.reject(err);
  }
);

export default ApiClient;
