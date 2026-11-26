// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import { Search, Eye, ChevronDown } from "lucide-react";
import OrderService from "../services/OrderService";
import ServiceRecordService from "../services/ServiceRecordService";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import { useAuth } from "../contexts/AuthContext";

export default function Orders() {
  const { role } = useAuth();

  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal chi tiết đơn
  const [showDetail, setShowDetail] = useState(false);
  const [detail, setDetail] = useState(null);

  // Modal tạo dịch vụ
  const [showCreateService, setShowCreateService] = useState(false);

  const [serviceName, setServiceName] = useState("");
  const [serviceDesc, setServiceDesc] = useState("");
  const [serviceList, setServiceList] = useState([]);

  // ==========================================================
  // LOAD LIST ORDERS
  // ==========================================================
  const load = async () => {
    try {
      const res = await OrderService.getAll({ keyword, page, size: 10 });
      setList(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch (e) {
      console.error(e);
      toast.error("Không thể tải danh sách đơn hàng");
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  // ==========================================================
  // CẬP NHẬT TRẠNG THÁI ĐƠN
  // ==========================================================
  const updateStatus = async (id, status) => {
    try {
      await OrderService.updateStatus(id, status);
      toast.success("Đã cập nhật trạng thái");
      load();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  // ==========================================================
  // XEM CHI TIẾT ĐƠN + LỊCH SỬ DỊCH VỤ
  // ==========================================================
  const openDetail = async (o) => {
    setDetail(o);
    setShowDetail(true);

    try {
      const res = await ServiceRecordService.getByOrder(o.id);
      setServiceList(res.data);
    } catch {
      setServiceList([]);
    }
  };

  // ==========================================================
  // RENDER
  // ==========================================================
  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý đơn hàng</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">Mã đơn</th>
              <th className="px-6 py-3 text-left">Khách hàng</th>
              <th className="px-6 py-3 text-left">Tổng tiền</th>
              <th className="px-6 py-3 text-left">Ngày tạo</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-2">{o.orderCode}</td>
                <td className="px-6 py-2">{o.customer?.name}</td>

                <td className="px-6 py-2 text-indigo-600 font-bold">
                  {o.totalAmount?.toLocaleString()}₫
                </td>

                <td className="px-6 py-2">{o.createdAt?.slice(0, 10)}</td>

                <td className="px-6 py-2">
                  <div className="relative">
                    <select
                      value={o.status}
                      onChange={async (e) => {
                        const next = e.target.value;

                        if (role === "EMPLOYEE" && next === "Hủy") {
                          toast.error("Nhân viên không được phép hủy đơn!");
                          return;
                        }

                        await updateStatus(o.id, next);

                        setList((prev) =>
                          prev.map((x) =>
                            x.id === o.id ? { ...x, status: next } : x
                          )
                        );
                      }}
                      className="border rounded-md px-3 py-1.5 pr-10 appearance-none bg-white w-full"
                    >
                      <option value="Đang xử lý">Đang xử lý</option>
                      <option value="Hoàn thành">Hoàn thành</option>

                      {/* ADMIN mới được hủy */}
                      {role === "ADMIN" && <option value="Hủy">Hủy</option>}
                    </select>

                    <ChevronDown
                      size={18}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                    />
                  </div>
                </td>

                <td className="px-6 py-2">
                  <button
                    className="text-indigo-600 hover:cursor-pointer"
                    onClick={() => openDetail(o)}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* ======================================================
            MODAL CHI TIẾT ĐƠN
      ====================================================== */}
      <Modal
        open={showDetail}
        title="Chi tiết đơn hàng"
        onClose={() => setShowDetail(false)}
      >
        {detail && (
          <div className="space-y-4 text-sm">
            {/* Thông tin chung */}
            <div className="flex justify-between items-center pb-3 border-b">
              <p>
                <span className="font-semibold">Mã đơn:</span>{" "}
                {detail.orderCode}
              </p>
              <p className="text-indigo-600 font-bold text-lg">
                {detail.totalAmount?.toLocaleString()}₫
              </p>
            </div>

            {/* 2 cột: khách hàng & xe */}
            <div className="grid grid-cols-2 gap-6">
              <div className="p-4 rounded-md bg-gray-50 space-y-2">
                <h3 className="font-semibold text-gray-700 border-b pb-1">
                  Thông tin khách hàng
                </h3>
                <p>
                  <b>Tên:</b> {detail.customer?.name}
                </p>
                <p>
                  <b>SĐT:</b> {detail.customer?.phone}
                </p>
                <p>
                  <b>Email:</b> {detail.customer?.email}
                </p>
                <p>
                  <b>Địa chỉ:</b> {detail.customer?.address}
                </p>
              </div>

              <div className="p-4 rounded-md bg-gray-50 space-y-2">
                <h3 className="font-semibold text-gray-700 border-b pb-1">
                  Thông tin xe
                </h3>
                <p>
                  <b>VIN:</b> {detail.vehicle?.vin}
                </p>
                <p>
                  <b>Model:</b> {detail.vehicle?.modelName}
                </p>
                <p>
                  <b>Màu:</b> {detail.vehicle?.color}
                </p>
                <p>
                  <b>Giá:</b> {detail.vehicle?.price?.toLocaleString()}₫
                </p>
              </div>
            </div>

            {/* Lịch sử dịch vụ */}
            <div className="pt-4 border-t">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-gray-700">Lịch sử dịch vụ</h3>
                {detail.status === "Hoàn thành" && (
                  <button
                    className="px-3 py-1 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    onClick={() => setShowCreateService(true)}
                  >
                    Tạo dịch vụ
                  </button>
                )}
              </div>

              {serviceList.length === 0 ? (
                <p className="text-gray-500 italic">Chưa có dịch vụ nào</p>
              ) : (
                <table className="w-full text-sm border rounded-md overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="p-2 text-left">Tên dịch vụ</th>
                      <th className="p-2 text-left">Mô tả</th>
                      <th className="p-2 text-left">Ngày tạo</th>
                      <th className="p-2 text-left">Trạng thái</th>
                    </tr>
                  </thead>
                  <tbody>
                    {serviceList.map((s) => (
                      <tr key={s.id} className="border-t hover:bg-gray-50">
                        <td className="p-2">{s.serviceName}</td>
                        <td className="p-2">{s.description}</td>
                        <td className="p-2">{s.createdAt?.slice(0, 10)}</td>

                        <td className="p-2 relative">
                          <select
                            value={s.status}
                            onChange={async (e) => {
                              try {
                                await ServiceRecordService.updateStatus({
                                  id: s.id,
                                  status: e.target.value,
                                });
                                toast.success("Đã cập nhật");
                                openDetail(detail);
                              } catch {
                                toast.error("Không thể cập nhật");
                              }
                            }}
                            className="border px-2 py-1 rounded-md appearance-none w-full pr-8 bg-white"
                          >
                            <option value="Chờ xử lý">Chờ xử lý</option>
                            <option value="Đang làm">Đang làm</option>
                            <option value="Hoàn thành">Hoàn thành</option>
                          </select>

                          <ChevronDown
                            size={18}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
      </Modal>

      {/* ======================================================
          MODAL TẠO DỊCH VỤ
      ====================================================== */}
      <Modal
        open={showCreateService}
        title="Tạo dịch vụ"
        onClose={() => setShowCreateService(false)}
      >
        <div className="space-y-3">
          <input
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Tên dịch vụ"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />

          <textarea
            className="w-full border px-3 py-2 rounded-md"
            placeholder="Mô tả"
            value={serviceDesc}
            onChange={(e) => setServiceDesc(e.target.value)}
          />

          <div className="flex justify-end">
            <button
              onClick={async () => {
                try {
                  await ServiceRecordService.create({
                    orderId: detail.id,
                    serviceName,
                    description: serviceDesc,
                  });

                  toast.success("Đã tạo dịch vụ");
                  setShowCreateService(false);
                  openDetail(detail);
                } catch {
                  toast.error("Không thể tạo dịch vụ");
                }
              }}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Tạo dịch vụ
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
