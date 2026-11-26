// src/components/Pagination.jsx
import React from "react";

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center space-x-4 mt-4">
      <button
        onClick={() => onChange(page - 1)}
        disabled={page === 0}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
      >
        Trang trước
      </button>
      <span>{page + 1} / {totalPages}</span>
      <button
        onClick={() => onChange(page + 1)}
        disabled={page + 1 === totalPages}
        className="px-3 py-1 border rounded disabled:opacity-50 hover:cursor-pointer"
      >
        Trang sau
      </button>
    </div>
  );
}
