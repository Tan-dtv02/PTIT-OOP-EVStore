import React, { useEffect, useState } from "react";
import { Search, Plus, Edit3, Trash2, ChevronDown } from "lucide-react";
import UserService from "../services/UserService";
import toast from "react-hot-toast";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import Pagination from "../components/Pagination";

export default function Employees() {
  const [list, setList] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    role: "EMPLOYEE",
    active: true,
  });

  const [confirmId, setConfirmId] = useState(null);

  const load = async () => {
    try {
      const res = await UserService.getAll({
        keyword,
        role: role || undefined,
        page,
        size: 10,
      });
      setList(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Không thể tải danh sách nhân viên");
    }
  };

  useEffect(() => {
    load();
  }, [page, role]);

  const openCreate = () => {
    setEditing(null);
    setForm({
      username: "",
      fullName: "",
      email: "",
      password: "",
      role: "EMPLOYEE",
      active: true,
    });
    setShowForm(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({
      username: u.username,
      fullName: u.fullName,
      email: u.email,
      password: "",
      role: u.role,
      active: u.active,
    });
    setShowForm(true);
  };

  const validateForm = () => {
    if (!form.username.trim()) return toast.error("Username bắt buộc");

    if (!editing && !form.password.trim())
      return toast.error("Mật khẩu bắt buộc khi tạo mới");

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      if (editing) {
        await UserService.update(editing.id, form);
        toast.success("Cập nhật nhân viên thành công");
      } else {
        await UserService.create(form);
        toast.success("Thêm nhân viên thành công");
      }
      setShowForm(false);
      load();
    } catch {
      toast.error("Lưu nhân viên thất bại");
    }
  };

  const handleDelete = async () => {
    try {
      await UserService.remove(confirmId);
      toast.success("Xoá nhân viên thành công");
      setConfirmId(null);
      load();
    } catch {
      toast.error("Không thể xoá nhân viên");
    }
  };

  const handleToggleActive = async (id, active) => {
    try {
      await UserService.toggleActive(id, active);
      toast.success("Đã cập nhật trạng thái");
      load();
    } catch {
      toast.error("Không thể cập nhật trạng thái");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-wrap justify-between items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý nhân viên</h1>

        <div className="flex gap-3">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full px-4 py-2 pl-9 border rounded-md focus:ring-indigo-200"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>

          <div className="relative">
            <select
              className="px-3 py-2 pr-8 border rounded-md appearance-none w-full"
              value={role}
              onChange={(e) => {
                setRole(e.target.value);
                setPage(0);
              }}
            >
              <option value="">Tất cả</option>
              <option value="ADMIN">ADMIN</option>
              <option value="EMPLOYEE">EMPLOYEE</option>
            </select>

            {/* Icon đặt ngoài select */}
            <ChevronDown
              size={18}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
            />
          </div>

          <button
            className="hover:cursor-pointer px-4 py-2 bg-indigo-600 text-white rounded-lg flex items-center gap-2 hover:bg-indigo-700"
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
              <th className="px-6 py-3 text-left">Tên người dùng</th>
              <th className="px-6 py-3 text-left">Họ tên</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Vai trò</th>
              <th className="px-6 py-3 text-left">Trạng thái</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {list.map((u) => (
              <tr key={u.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-2">{u.username}</td>
                <td className="px-6 py-2">{u.fullName}</td>
                <td className="px-6 py-2">{u.email}</td>
                <td className="px-6 py-2">{u.role}</td>
                <td className="px-6 py-2">
                  {u.role === "ADMIN" ? (
                    <span className="text-gray-500 text-sm italic">--</span>
                  ) : (
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={u.active}
                        onChange={(e) =>
                          handleToggleActive(u.id, e.target.checked)
                        }
                        className="sr-only peer"
                      />
                      <div className="w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-green-500 transition-colors"></div>

                      <span
                        className="
        absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-md 
        transition-all peer-checked:translate-x-6
      "
                      ></span>
                    </label>
                  )}
                </td>
                <td className="px-6 py-2">
                  {u.role === "ADMIN" ? (
                    <span className="text-gray-500 text-sm italic">--</span>
                  ) : (
                    <div className="flex gap-3">
                      <button
                        className="text-indigo-600 hover:cursor-pointer"
                        onClick={() => openEdit(u)}
                      >
                        <Edit3 size={18} />
                      </button>
                      <button
                        className="text-red-600 hover:cursor-pointer"
                        onClick={() => setConfirmId(u.id)}
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}

            {list.length === 0 && (
              <tr>
                <td colSpan={6} className="py-8 text-center text-gray-400">
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
        title={editing ? "Sửa nhân viên" : "Thêm nhân viên"}
        onClose={() => setShowForm(false)}
      >
        <form className="space-y-3" onSubmit={handleSubmit}>
          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Tên người dùng"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={!!editing}
            required
          />

          {editing ? (
            <input
              className="w-full px-4 py-2 border rounded-md"
              type="password"
              placeholder="Mật khẩu mới (không bắt buộc)"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          ) : (
            <input
              className="w-full px-4 py-2 border rounded-md"
              type="password"
              placeholder="Mật khẩu"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          )}

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Họ tên"
            value={form.fullName}
            onChange={(e) => setForm({ ...form, fullName: e.target.value })}
          />

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <input type="hidden" value="EMPLOYEE" />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 hover:cursor-pointer border rounded-lg"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-4 py-2 hover:cursor-pointer bg-indigo-600 text-white rounded-lg"
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={!!confirmId}
        title="Xác nhận xoá"
        message="Bạn chắc chắn muốn xoá nhân viên này?"
        onCancel={() => setConfirmId(null)}
        onConfirm={handleDelete}
      />
    </div>
  );
}
