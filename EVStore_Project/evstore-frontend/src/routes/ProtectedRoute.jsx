import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { ACCESS_KEY } from "../services/ApiClient";

export default function ProtectedRoute({ children, allowRoles }) {
  const { role, user } = useAuth();

  const token =
    localStorage.getItem(ACCESS_KEY) ||
    sessionStorage.getItem(ACCESS_KEY);

  // Chưa đăng nhập
  if (!token) return <Navigate to="/login" replace />;

  // AuthContext chưa load xong → tránh flicker
  if (role === null) return null;

  // Nếu token hết hạn (AuthContext đã giải mã rồi)
  if (user?.exp && user.exp * 1000 < Date.now()) {
    localStorage.clear();
    sessionStorage.clear();
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role được phép vào route
  if (allowRoles && !allowRoles.includes(role)) {
    if (role === "EMPLOYEE") return <Navigate to="/app/models" replace />;
    return <Navigate to="/app/dashboard" replace />;
  }

  return children;
}
