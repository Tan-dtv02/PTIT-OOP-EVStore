// src/pages/Login.jsx
import React, { useState } from "react";
import AuthService from "../services/AuthService";
import { ACCESS_KEY, REFRESH_KEY } from "../services/ApiClient";
import { useNavigate } from "react-router-dom";
import { User, Lock, Eye, EyeOff, Zap, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { loadUserFromToken } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await AuthService.login({ username, password });

      const access = res.accessToken;
      const refresh = res.refreshToken;

      if (!access) {
        setError("Token từ server không hợp lệ!");
        return;
      }

      // Lưu token
      if (rememberMe) {
        localStorage.setItem(ACCESS_KEY, access);
        localStorage.setItem(REFRESH_KEY, refresh);
      } else {
        sessionStorage.setItem(ACCESS_KEY, access);
        sessionStorage.setItem(REFRESH_KEY, refresh);
      }

      toast.success("Đăng nhập thành công!");

      loadUserFromToken((roleLoaded) => {
        navigate(roleLoaded === "ADMIN" ? "/app/dashboard" : "/app/models");
      });
    } catch (err) {
      console.error("LOGIN ERROR::", err);
      setError("Đăng nhập thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-indigo-50 relative overflow-hidden font-sans">
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 pointer-events-none"></div>
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 sm:p-10 mx-4">
        <div className="text-center mb-8">
          <div className="mx-auto mb-4 w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-sm">
            <Zap size={32} fill="currentColor" />
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 mb-2">
            EV Manager System
          </h1>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-600 text-sm rounded-xl border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">
              Tên người dùng
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type="text"
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-bold text-gray-700">
              Mật khẩu
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-indigo-500 transition-colors" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                className="w-full pl-11 pr-12 py-3 bg-gray-50 border border-gray-200 text-gray-900 text-sm rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-indigo-600 transition-colors focus:outline-none hover:cursor-pointer"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="ml-2 text-gray-600 select-none">
                Ghi nhớ đăng nhập
              </span>
            </label>
            <a
              href="#"
              className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
            >
              Quên mật khẩu?
            </a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`hover:cursor-pointer w-full py-3.5 text-white font-bold rounded-xl shadow-lg shadow-indigo-200 transition-all duration-300 text-base flex justify-center items-center gap-2 ${
              loading
                ? "bg-indigo-400 cursor-not-allowed"
                : "bg-indigo-600 hover:bg-indigo-700 hover:shadow-indigo-300 hover:-translate-y-0.5 active:translate-y-0"
            }`}
          >
            {loading && <Loader2 size={20} className="animate-spin" />}
            {loading ? "Đang xử lý..." : "Đăng Nhập"}
          </button>
        </form>

        <div className="mt-8 text-center space-y-4">
          <div className="text-xs text-gray-400 border-t border-gray-100 pt-6">
            Version 1.0.0 • © 2025 EV Manager
          </div>
        </div>
      </div>
    </div>
  );
}
