// src/pages/Vehicles.jsx
import React, { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Edit3,
  Trash2,
  ShoppingBag,
  ChevronDown,
} from "lucide-react";
import VehicleService from "../services/VehicleService";
import VehicleModelService from "../services/VehicleModelService";
import CustomerService from "../services/CustomerService";
import OrderService from "../services/OrderService";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import { useAuth } from "../contexts/AuthContext"; // 🔥 lấy role từ context

export default function Vehicles() {
  const { role } = useAuth(); // 🔥 phân quyền

  const [list, setList] = useState([]);
  const [models, setModels] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [selectedModel, setSelectedModel] = useState("");

  // Form xe
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    modelId: "",
    vin: "",
    color: "",
    status: "Tồn kho",
  });

  // Xoá xe
  const [confirmId, setConfirmId] = useState(null);

  // Modal tạo đơn từ xe
  const [orderModalOpen, setOrderModalOpen] = useState(false);
  const [orderVehicle, setOrderVehicle] = useState(null);

  const [customerKeyword, setCustomerKeyword] = useState("");
  const [customerResults, setCustomerResults] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // ===============================
  // LOAD DATA
  // ===============================
  const load = async () => {
    try {
      const res = await VehicleService.getAll({
        keyword,
        model: selectedModel || undefined,
        page,
        size: 10,
      });

      setList(res.data.content);
      setTotalPages(res.data.totalPages);

      const m = await VehicleModelService.getAll({ page: 0, size: 999 });
      setModels(m.data.content);
    } catch (err) {
      console.error(err);
      toast.error("Không thể tải danh sách xe");
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  // ===============================
  // OPEN FORMS
  // ===============================
  const openCreate = () => {
    setEditing(null);
    setForm({
      modelId: "",
      vin: "",
      color: "",
      status: "Tồn kho",
    });
    setShowForm(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      modelId: v.modelId || v.model?.id,
      vin: v.vin,
      color: v.color,
      status: v.status,
    });
    setShowForm(true);
  };

  // Mở modal tạo đơn từ 1 xe
  const openOrderModal = (v) => {
    setOrderVehicle(v);
    setOrderModalOpen(true);
    setCustomerKeyword("");
    setCustomerResults([]);
    setSelectedCustomer(null);
  };

  // ===============================
  // VALIDATION FORM XE
  // ===============================
  const validateForm = () => {
    if (!form.modelId) return toast.error("Chọn mẫu xe");
    if (!form.vin.trim()) return toast.error("VIN bắt buộc");
    if (form.vin.length < 6) return toast.error("VIN quá ngắn");
    if (!form.color.trim()) return toast.error("Màu xe bắt buộc");
    return true;
  };

  // ===============================
  // SUBMIT FORM XE
  // ===============================
  const submitForm = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const payload = {
      modelId: Number(form.modelId),
      vin: form.vin.trim(),
      color: form.color.trim(),
      status: form.status,
    };

    try {
      if (editing) {
        await VehicleService.update(editing.id, payload);
        toast.success("Cập nhật xe thành công");
      } else {
        await VehicleService.create(payload);
        toast.success("Thêm xe thành công");
      }

      setShowForm(false);
      load();
    } catch (err) {
      console.error(err);
      toast.error("Không lưu được xe (VIN trùng?)");
    }
  };

  // ===============================
  // DELETE HANDLER
  // ===============================
  const deleteItem = async () => {
    if (role === "EMPLOYEE") return; // ❌ chặn employee

    try {
      await VehicleService.remove(confirmId);
      toast.success("Xoá thành công");
      setConfirmId(null);
      load();
    } catch {
      toast.error("Không thể xoá xe");
    }
  };

  // ===============================
  // SEARCH CUSTOMER FOR ORDER
  // ===============================
  const searchCustomers = async () => {
    if (!customerKeyword.trim()) {
      setCustomerResults([]);
      return;
    }
    try {
      setSearchLoading(true);
      const res = await CustomerService.getAll({
        keyword: customerKeyword,
        page: 0,
        size: 10,
      });
      setCustomerResults(res.data.content);
    } catch {
      toast.error("Không tìm được khách hàng");
    } finally {
      setSearchLoading(false);
    }
  };

  // ===============================
  // TẠO ĐƠN HÀNG TỪ XE
  // ===============================
  const createOrderFromVehicle = async () => {
    if (!orderVehicle) return toast.error("Không xác định xe");
    if (!selectedCustomer) return toast.error("Chọn khách hàng");

    try {
      await OrderService.create({
        customerId: selectedCustomer.id,
        vehicleId: orderVehicle.id,
      });
      toast.success("Tạo đơn hàng thành công");
      setOrderModalOpen(false);
      setOrderVehicle(null);
      load();
    } catch {
      toast.error("Không thể tạo đơn hàng");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý xe</h1>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full px-4 py-2 pl-9 border rounded-md focus:ring-indigo-200"
              placeholder="Tìm theo VIN..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>

          {/* FILTER MODEL */}
          <div className="relative">
            <select
              className="px-4 py-2 pr-8 border rounded-md appearance-none hover:cursor-pointer"
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setPage(0);
                load();
              }}
            >
              <option value="">Lọc theo mẫu</option>
              {models.map((m) => (
                <option key={m.id} value={m.modelName}>
                  {m.modelName}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <button
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
            onClick={openCreate}
          >
            <Plus size={18} /> Thêm
          </button>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">VIN</th>
              <th className="px-6 py-3 text-left">Mẫu xe</th>
              <th className="px-6 py-3 text-left">Màu</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {list.map((v) => (
              <tr key={v.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-2">{v.vin}</td>
                <td className="px-6 py-2">
                  {v.modelName || v.model?.modelName}
                </td>
                <td className="px-6 py-2">{v.color}</td>
                <td className="px-6 py-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      v.status === "Tồn kho"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {v.status}
                  </span>
                </td>

                <td className="px-6 py-2">
                  <div className="flex gap-3 items-center">
                    <button
                      className="text-indigo-600 hover:text-indigo-800 hover:cursor-pointer"
                      onClick={() => openEdit(v)}
                    >
                      <Edit3 size={18} />
                    </button>

                    {role === "ADMIN" && (
                      <button
                        className="text-red-600 hover:text-red-800 hover:cursor-pointer"
                        onClick={() => setConfirmId(v.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}

                    {/* TẠO ĐƠN — EMPLOYEE & ADMIN */}
                    {v.status === "Tồn kho" && (
                      <button
                        className="text-emerald-600 hover:text-emerald-800 flex items-center gap-1 text-xs font-medium hover:cursor-pointer"
                        onClick={() => openOrderModal(v)}
                      >
                        <ShoppingBag size={16} /> Tạo đơn
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={5} className="py-8 text-center text-gray-400">
                  Không có dữ liệu
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      {/* ===== MODAL THÊM / SỬA XE ===== */}
      <Modal
        open={showForm}
        title={editing ? "Sửa xe" : "Thêm xe"}
        onClose={() => setShowForm(false)}
      >
        <form className="space-y-3" onSubmit={submitForm}>
          <div className="relative">
            <select
              className="w-full px-4 py-2 pr-8 border rounded-md appearance-none"
              value={form.modelId}
              onChange={(e) => setForm({ ...form, modelId: e.target.value })}
              required
            >
              <option value="">Chọn mẫu xe</option>
              {models.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.modelName}
                </option>
              ))}
            </select>

            <ChevronDown
              size={18}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="VIN xe"
            value={form.vin}
            onChange={(e) => setForm({ ...form, vin: e.target.value })}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Màu xe"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            required
          />

          <div className="relative">
            <select
              className="w-full px-4 py-2 pr-8 border rounded-md appearance-none"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="Tồn kho">Tồn kho</option>
              <option value="Đã bán">Đã bán</option>
            </select>

            <ChevronDown
              size={18}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg hover:bg-gray-100"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>

            <button
              type="submit"
              className={`px-4 py-2 rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer`}
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE DIALOG */}
      <ConfirmDialog
        open={!!confirmId}
        title="Xác nhận xoá"
        message="Bạn muốn xoá xe này?"
        onCancel={() => setConfirmId(null)}
        onConfirm={deleteItem}
      />

      {/* ===== MODAL TẠO ĐƠN ===== */}
      <Modal
        open={orderModalOpen}
        title="Tạo đơn hàng"
        onClose={() => setOrderModalOpen(false)}
      >
        {orderVehicle && (
          <div className="space-y-4 text-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* LEFT: VEHICLE */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Thông tin xe
                </h3>
                <p>
                  <b>VIN:</b> {orderVehicle.vin}
                </p>
                <p>
                  <b>Mẫu:</b>{" "}
                  {orderVehicle.modelName || orderVehicle.model?.modelName}
                </p>
                <p>
                  <b>Màu:</b> {orderVehicle.color}
                </p>
                <p>
                  <b>Trạng thái:</b> {orderVehicle.status}
                </p>
              </div>

              {/* RIGHT: CUSTOMER */}
              <div className="border rounded-lg p-3 bg-gray-50">
                <h3 className="font-semibold mb-2 text-gray-800">
                  Thông tin khách hàng
                </h3>
                {selectedCustomer ? (
                  <>
                    <p>
                      <b>Tên:</b> {selectedCustomer.name}
                    </p>
                    <p>
                      <b>SĐT:</b> {selectedCustomer.phone}
                    </p>
                    <p>
                      <b>Email:</b> {selectedCustomer.email}
                    </p>
                    <p>
                      <b>Địa chỉ:</b> {selectedCustomer.address}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-400 text-xs">Chưa chọn khách hàng</p>
                )}
              </div>
            </div>

            {/* SEARCH CUSTOMER */}
            <div className="space-y-2">
              <label className="text-xs font-medium text-gray-600">
                Tìm khách hàng
              </label>
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  className="w-full px-4 py-2 pl-9 border rounded-md"
                  placeholder="Tên / SĐT / email..."
                  value={customerKeyword}
                  onChange={(e) => setCustomerKeyword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && searchCustomers()}
                />
              </div>

              <button
                type="button"
                onClick={searchCustomers}
                className="mt-1 px-3 py-1.5 text-xs rounded-md bg-indigo-600 text-white hover:bg-indigo-700"
              >
                {searchLoading ? "Đang tìm..." : "Tìm khách"}
              </button>

              {customerResults.length > 0 && (
                <ul className="mt-2 max-h-40 overflow-y-auto border rounded-md divide-y text-xs">
                  {customerResults.map((c) => (
                    <li
                      key={c.id}
                      className={`px-3 py-2 cursor-pointer hover:bg-indigo-50 ${
                        selectedCustomer?.id === c.id
                          ? "bg-indigo-100"
                          : "bg-white"
                      }`}
                      onClick={() => setSelectedCustomer(c)}
                    >
                      <div className="font-semibold">{c.name}</div>
                      <div className="text-gray-500">
                        {c.phone} — {c.email}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                className="px-4 py-2 border rounded-lg hover:bg-gray-50 hover:cursor-pointer"
                onClick={() => setOrderModalOpen(false)}
              >
                Hủy
              </button>
              <button
                type="button"
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 hover:cursor-pointer"
                onClick={createOrderFromVehicle}
              >
                Tạo đơn
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
