// src/pages/Dashboard.jsx
import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";

import ApiClient from "../services/ApiClient";
import DashboardService from "../services/DashboardService";
import { Car, ShoppingBag, Users, User } from "lucide-react";

// Register chart elements
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white p-5 rounded-2xl shadow-sm border flex justify-between items-center">
    <div>
      <p className="text-xs text-gray-500 uppercase">{title}</p>
      <p className="text-3xl font-bold text-gray-800 mt-1">{value}</p>
    </div>
    <div className="p-3 rounded-xl bg-indigo-600 text-white">
      <Icon size={24} />
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState({
    vehicles: 0,
    orders: 0,
    employees: 0,
    customers: 0,
  });

  const [overview, setOverview] = useState({
    revenueGrowth: [],
    customerGrowth: [],
    topVehicleModels: [],
    recentOrders: [],
  });

  // ======================
  // Load basic stats
  // ======================
  useEffect(() => {
    const loadStats = async () => {
      try {
        const [v, o, u, c] = await Promise.all([
          ApiClient.get("/vehicles", { params: { page: 0, size: 1 } }),
          ApiClient.get("/orders", { params: { page: 0, size: 1 } }),
          ApiClient.get("/users", { params: { page: 0, size: 1 } }),
          ApiClient.get("/customers", { params: { page: 0, size: 1 } }),
        ]);
        setStats({
          vehicles: v.data.totalElements,
          orders: o.data.totalElements,
          employees: u.data.totalElements,
          customers: c.data.totalElements,
        });
      } catch (e) {
        console.error("Load stats error", e);
      }
    };

    loadStats();
  }, []);

  // ======================
  // Load dashboard overview
  // ======================
  useEffect(() => {
    const loadOverview = async () => {
      try {
        const data = await DashboardService.getOverview();
        setOverview(data);
      } catch (e) {
        console.error("Load dashboard error", e);
      }
    };

    loadOverview();
  }, []);

  // ======================
  // Chart Data
  // ======================
  const revenueChart = {
    labels: overview.revenueGrowth.map((x) => x.month),
    datasets: [
      {
        label: "Doanh thu",
        data: overview.revenueGrowth.map((x) => x.revenue),
        borderColor: "#6366F1",
        backgroundColor: "rgba(99, 102, 241, 0.3)",
      },
    ],
  };

  const customerChart = {
    labels: overview.customerGrowth.map((x) => x.month),
    datasets: [
      {
        label: "Khách hàng mới",
        data: overview.customerGrowth.map((x) => x.customers),
        borderColor: "#10B981",
        backgroundColor: "rgba(16, 185, 129, 0.3)",
      },
    ],
  };

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-gray-800">Thống kê</h1>

      {/* TOP STAT */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard title="Tổng xe" value={stats.vehicles} icon={Car} />
        <StatCard
          title="Tổng đơn hàng"
          value={stats.orders}
          icon={ShoppingBag}
        />
        <StatCard title="Nhân viên" value={stats.employees} icon={Users} />
        <StatCard title="Khách hàng" value={stats.customers} icon={User} />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">
            🚀 Doanh thu theo tháng
          </h2>
          <Line data={revenueChart} />
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-3">
            👥 Khách hàng mới theo tháng
          </h2>
          <Line data={customerChart} />
        </div>
      </div>

      {/* TOP MODELS + RECENT ORDERS (2/5 + 3/5) */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* LEFT: Top Vehicle Models (2/5) */}
        <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">🔥 Mẫu xe bán chạy</h2>

          <ul className="space-y-2">
            {overview.topVehicleModels.map((m, i) => (
              <li
                key={i}
                className={`flex justify-between py-2 ${
                  i < overview.topVehicleModels.length - 1 ? "border-b" : ""
                }`}
              >
                <span className="font-medium text-gray-700">{m.modelName}</span>
                <span className="text-indigo-600 font-semibold">
                  {m.totalSales} xe
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RIGHT: Recent Orders (3/5) */}
        <div className="xl:col-span-3 bg-white p-6 rounded-2xl shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">🧾 Đơn hàng gần đây</h2>

          <table className="w-full text-sm">
            <thead>
              <tr className="border-b text-left">
                <th className="p-2">Mã đơn</th>
                <th className="p-2">Khách hàng</th>
                <th className="p-2">Tổng tiền</th>
                <th className="p-2">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {overview.recentOrders.map((o, i) => (
                <tr key={i} className="border-b">
                  <td className="p-2">{o.orderCode}</td>
                  <td className="p-2">{o.customer}</td>
                  <td className="p-2 font-semibold text-indigo-600">
                    {Number(o.totalAmount).toLocaleString()} đ
                  </td>
                  <td className="p-2">{new Date(o.date).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
