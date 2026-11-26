import React from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Car,
  ShoppingBag,
  Zap,
  UserCog,
  LogOut,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import AuthService from "../services/AuthService";

export default function DashboardLayout() {
  const { pathname } = useLocation();
  const { role } = useAuth(); // 🔥 Lấy role global từ AuthContext

  const MenuItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all font-medium 
      ${
        pathname === to
          ? "bg-indigo-600 text-white shadow-md"
          : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600"
      }`}
    >
      <Icon size={20} /> <span>{label}</span>
    </Link>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* SIDEBAR */}
      <aside className="w-72 bg-white border-r border-gray-100 fixed h-full flex flex-col">
        {/* LOGO */}
        <div className="p-6 border-b border-gray-50 flex items-center gap-3 text-indigo-700">
          <div className="p-2 bg-indigo-600 rounded-xl text-white shadow">
            <Zap size={24} />
          </div>
          <div>
            <h1 className="text-lg font-extrabold">EV Manager</h1>
            <p className="text-xs text-indigo-400 uppercase font-medium">
              Admin Panel
            </p>
          </div>
        </div>

        {/* MENU */}
        <nav className="flex-1 p-6 space-y-2 overflow-y-auto">
          {role === "ADMIN" && (
            <MenuItem
              to="/app/dashboard"
              icon={LayoutDashboard}
              label="Thống kê"
            />
          )}

          <MenuItem to="/app/models" icon={Car} label="Quản lý mẫu xe" />
          <MenuItem to="/app/vehicles" icon={Car} label="Quản lý xe" />
          <MenuItem
            to="/app/orders"
            icon={ShoppingBag}
            label="Quản lý đơn hàng"
          />

          {role === "ADMIN" && (
            <>
              <MenuItem
                to="/app/employees"
                icon={Users}
                label="Quản lý nhân viên"
              />
              <MenuItem
                to="/app/customers"
                icon={UserCog}
                label="Quản lý khách hàng"
              />
            </>
          )}
        </nav>

        {/* USER + LOGOUT */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-extrabold">
              {role?.substring(0, 2) || "??"}
            </div>

            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold text-gray-800 truncate">{role}</p>
            </div>

            <button
              onClick={() => AuthService.logout()}
              className="text-gray-400 hover:text-red-500 hover:cursor-pointer transition-colors"
              title="Đăng xuất"
            >
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 ml-72 p-8">
        <Outlet />
      </main>
    </div>
  );
}
