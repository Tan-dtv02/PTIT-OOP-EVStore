import React, { useEffect, useState } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import VehicleModelService from "../services/VehicleModelService";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";
import { useAuth } from "../contexts/AuthContext";

export default function VehicleModels() {
  const { role } = useAuth(); // 🔥 Role từ AuthContext

  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Form theo entity BE
  const [form, setForm] = useState({
    modelName: "",
    brand: "",
    batteryCapacity: "",
    rangeKm: "",
    basePrice: "",
  });

  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    try {
      const res = await VehicleModelService.getAll({
        keyword,
        page,
        size: 10,
      });
      setList(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Không thể tải mẫu xe");
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      modelName: "",
      brand: "",
      batteryCapacity: "",
      rangeKm: "",
      basePrice: "",
    });
    setShowForm(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      modelName: v.modelName,
      brand: v.brand,
      batteryCapacity: v.batteryCapacity,
      rangeKm: v.rangeKm,
      basePrice: v.basePrice,
    });
    setShowForm(true);
  };

  const validateForm = () => {
    if (!form.modelName.trim()) return toast.error("Tên mẫu xe bắt buộc");
    if (!form.brand.trim()) return toast.error("Thương hiệu bắt buộc");

    if (form.basePrice !== "" && Number(form.basePrice) < 0)
      return toast.error("Giá không được âm");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      if (editing) {
        await VehicleModelService.update(editing.id, form);
        toast.success("Cập nhật mẫu xe thành công");
      } else {
        await VehicleModelService.create(form);
        toast.success("Thêm mẫu xe thành công");
      }
      setShowForm(false);
      load();
    } catch (e) {
      console.error(e);
      toast.error("Lưu dữ liệu thất bại");
    }
  };

  const handleDelete = async () => {
    if (role === "EMPLOYEE") return; // ❌ Chặn API

    try {
      await VehicleModelService.remove(confirmId);
      toast.success("Xoá thành công");
      setConfirmId(null);
      load();
    } catch {
      toast.error("Không thể xoá vì đang sử dụng");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý mẫu xe</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-200 focus:border-indigo-500"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>

          <button
            className="px-4 py-2 hover:cursor-pointer bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
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
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Tên mẫu
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Thương hiệu
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Pin
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Quãng đường
              </th>
              <th className="px-6 py-3 text-left font-medium text-gray-600">
                Giá
              </th>
              {role === "ADMIN" && (
                <th className="px-6 py-3 text-left font-medium text-gray-600">
                  Hành động
                </th>
              )}
            </tr>
          </thead>

          <tbody>
            {list.map((m) => (
              <tr key={m.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-2 text-gray-700">{m.modelName}</td>
                <td className="px-6 py-2 text-gray-700">{m.brand}</td>
                <td className="px-6 py-2 text-gray-700">
                  {m.batteryCapacity} kWh
                </td>
                <td className="px-6 py-2 text-gray-700">{m.rangeKm} km</td>
                <td className="px-6 py-2 text-gray-700">
                  {m.basePrice?.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-6 py-2">
                  <div className="flex gap-3">
                    <button
                      className="text-indigo-600 hover:cursor-pointer hover:text-indigo-800"
                      onClick={() => openEdit(m)}
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* 🔥 Chỉ ADMIN có quyền xoá */}
                    {role === "ADMIN" && (
                      <button
                        className="text-red-600 hover:cursor-pointer hover:text-red-800"
                        onClick={() => setConfirmId(m.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
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

      {/* FORM MODAL */}
      <Modal
        open={showForm}
        title={editing ? "Sửa mẫu xe" : "Thêm mẫu xe"}
        onClose={() => setShowForm(false)}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Tên mẫu xe"
            value={form.modelName}
            onChange={(e) => setForm({ ...form, modelName: e.target.value })}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Thương hiệu"
            value={form.brand}
            onChange={(e) => setForm({ ...form, brand: e.target.value })}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Dung lượng pin (kWh)"
            value={form.batteryCapacity}
            onChange={(e) =>
              setForm({ ...form, batteryCapacity: e.target.value })
            }
          />

          <input
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Quãng đường tối đa (km)"
            value={form.rangeKm}
            onChange={(e) => setForm({ ...form, rangeKm: e.target.value })}
          />

          <input
            type="number"
            className="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500"
            placeholder="Giá cơ bản (VNĐ)"
            value={form.basePrice}
            onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 hover:cursor-pointer border rounded-lg hover:bg-gray-100"
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

      {/* CONFIRM DELETE */}
      <ConfirmDialog
        open={!!confirmId}
        title="Xác nhận xoá"
        message="Bạn chắc chắn muốn xoá mẫu xe?"
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
