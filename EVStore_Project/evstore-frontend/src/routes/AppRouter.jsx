// src/routes/AppRouter.jsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import DashboardLayout from "../layout/DashboardLayout";
import ProtectedRoute from "./ProtectedRoute";

import Dashboard from "../pages/Dashboard";
import VehicleModels from "../pages/VehicleModels";
import Vehicles from "../pages/Vehicles";
import Orders from "../pages/Orders";
import Employees from "../pages/Employees";
import Customers from "../pages/Customers";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Mặc định vào login */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Public */}
        <Route path="/login" element={<Login />} />

        {/* Private Layout */}
        <Route
          path="/app"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* PUBLIC SAU LOGIN */}
          {/* ADMIN ONLY */}
          <Route
            path="dashboard"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          
          <Route path="models" element={<VehicleModels />} />
          <Route path="vehicles" element={<Vehicles />} />
          <Route path="orders" element={<Orders />} />

          {/* ADMIN ONLY */}
          <Route
            path="employees"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <Employees />
              </ProtectedRoute>
            }
          />

          <Route
            path="customers"
            element={
              <ProtectedRoute allowRoles={["ADMIN"]}>
                <Customers />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Cấm đường dẫn lung tung */}
        <Route path="*" element={<Navigate to="/app/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
