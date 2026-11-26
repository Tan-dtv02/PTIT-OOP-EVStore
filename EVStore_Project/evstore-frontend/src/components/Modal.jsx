// src/components/Modal.jsx
import React from "react";

export default function Modal({ open, title, children, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center 
                 bg-black/40 backdrop-blur-sm transition-all z-50"
    >
      <div className="bg-white p-6 rounded-xl shadow-xl 
                      w-[900px] max-w-[95vw] animate-scale-in"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">{title}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none hover:cursor-pointer"
          >
            &times;
          </button>
        </div>

        {children}
      </div>
    </div>
  );
}
