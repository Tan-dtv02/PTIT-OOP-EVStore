import { createContext, useContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { ACCESS_KEY } from "../services/ApiClient";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [role, setRole] = useState("LOADING");
  const [user, setUser] = useState(null);

  const loadUserFromToken = (callback) => {
    const token =
      localStorage.getItem(ACCESS_KEY) || sessionStorage.getItem(ACCESS_KEY);

    if (!token) {
      setRole("GUEST");
      setUser(null);
      callback && callback("GUEST");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setRole(decoded.role);

      callback && callback(decoded.role);
    } catch (err) {
      console.error("Decode error", err);
      setRole("GUEST");
      setUser(null);
      callback && callback("GUEST");
    }
  };

  // load khi mở trang
  useEffect(() => loadUserFromToken(), []);

  return (
    <AuthContext.Provider value={{ role, user, loadUserFromToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
