// src/services/AuthService.js
import ApiClient from "./ApiClient";
import { ACCESS_KEY, REFRESH_KEY } from "./ApiClient";

const AuthService = {
  login: async (data) => {
    const res = await ApiClient.post("/auth/login", data);
    return res.data;
  },

  logout() {
    localStorage.removeItem(ACCESS_KEY);
    localStorage.removeItem(REFRESH_KEY);
    sessionStorage.removeItem(ACCESS_KEY);
    sessionStorage.removeItem(REFRESH_KEY);
    window.location.href = "/login";
  },
};

export default AuthService;
