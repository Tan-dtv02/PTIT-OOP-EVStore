import React, { useEffect, useState } from "react";
import { Search, Plus, Edit3, Trash2 } from "lucide-react";
import CustomerService from "../services/CustomerService";
import toast from "react-hot-toast";
import Pagination from "../components/Pagination";
import Modal from "../components/Modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { useAuth } from "../contexts/AuthContext";

export default function Customers() {
  const { role } = useAuth(); // 🔥 Lấy role từ context

  const [list, setList] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [confirmId, setConfirmId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
  });

  const load = async () => {
    try {
      const res = await CustomerService.getAll({ keyword, page, size: 10 });
      setList(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      toast.error("Không thể tải khách hàng");
    }
  };

  useEffect(() => {
    load();
  }, [page]);

  // OPEN CREATE
  const openCreate = () => {
    setEditing(null);
    setForm({ name: "", phone: "", email: "", address: "" });
    setShowForm(true);
  };

  // OPEN EDIT
  const openEdit = (c) => {
    setEditing(c);
    setForm({
      name: c.name,
      phone: c.phone,
      email: c.email,
      address: c.address,
    });
    setShowForm(true);
  };

  // SAVE (EMPLOYEE vẫn được sửa và thêm)
  const save = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await CustomerService.update(editing.id, form);
        toast.success("Cập nhật khách hàng thành công");
      } else {
        await CustomerService.create(form);
        toast.success("Thêm khách hàng thành công");
      }
      setShowForm(false);
      load();
    } catch {
      toast.error("Không thể lưu khách hàng");
    }
  };

  // DELETE (EMPLOYEE không được xóa)
  const remove = async () => {
    if (role === "EMPLOYEE") return; // ❌ chặn API xóa

    try {
      await CustomerService.remove(confirmId);
      toast.success("Xoá thành công");
      setConfirmId(null);
      load();
    } catch {
      toast.error("Không thể xoá khách hàng");
    }
  };

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý khách hàng</h1>

        <div className="flex gap-3">
          {/* SEARCH */}
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              className="w-full px-4 py-2 pl-9 border border-gray-300 rounded-md"
              placeholder="Tìm kiếm..."
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
            />
          </div>

          {/* ADD BUTTON (EMPLOYEE vẫn được thêm) */}
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
              <th className="px-6 py-3 text-left">Tên</th>
              <th className="px-6 py-3 text-left">SĐT</th>
              <th className="px-6 py-3 text-left">Email</th>
              <th className="px-6 py-3 text-left">Địa chỉ</th>
              <th className="px-6 py-3 text-left">Hành động</th>
            </tr>
          </thead>

          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-2">{c.name}</td>
                <td className="px-6 py-2">{c.phone}</td>
                <td className="px-6 py-2">{c.email}</td>
                <td className="px-6 py-2">{c.address}</td>

                <td className="px-6 py-2">
                  <div className="flex gap-3">
                    {/* EDIT — ADMIN & EMPLOYEE đều được */}
                    <button
                      className="text-indigo-600 hover:text-indigo-800"
                      onClick={() => openEdit(c)}
                    >
                      <Edit3 size={18} />
                    </button>

                    {/* DELETE — chỉ ADMIN được */}
                    {role === "ADMIN" && (
                      <button
                        className="text-red-600 hover:text-red-800"
                        onClick={() => setConfirmId(c.id)}
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
                <td colSpan={5} className="px-6 py-8 text-center text-gray-400">
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
        title={editing ? "Sửa khách hàng" : "Thêm khách hàng"}
        onClose={() => setShowForm(false)}
      >
        <form className="space-y-3" onSubmit={save}>
          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Tên khách hàng"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Số điện thoại"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <input
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          <textarea
            className="w-full px-4 py-2 border rounded-md"
            placeholder="Địa chỉ"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <div className="flex justify-end gap-3">
            <button
              type="button"
              className="px-4 py-2 border rounded-lg"
              onClick={() => setShowForm(false)}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Lưu
            </button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRM (ADMIN ONLY) */}
      <ConfirmDialog
        open={!!confirmId}
        title="Xác nhận xoá"
        message="Bạn muốn xoá khách hàng này?"
        onCancel={() => setConfirmId(null)}
        onConfirm={remove}
      />
    </div>
  );
}
