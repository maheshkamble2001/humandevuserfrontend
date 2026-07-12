// src/pages/admin/roles/components/RolePagination.jsx
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const RolePagination = ({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  itemsPerPage,
  isSubmitting,
}) => {
  if (totalPages <= 1) return null;

  const start = (currentPage - 1) * itemsPerPage + 1;
  const end = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-400">
        Showing {start} - {end} of {totalItems} roles
      </p>
      <div className="flex gap-2">
        <button
          onClick={() => onPageChange((prev) => Math.max(1, prev - 1))}
          disabled={currentPage === 1 || isSubmitting}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 text-gray-400" />
        </button>
        <span className="px-3 py-2 text-sm text-gray-400">
          {currentPage} / {totalPages}
        </span>
        <button
          onClick={() => onPageChange((prev) => Math.min(totalPages, prev + 1))}
          disabled={currentPage === totalPages || isSubmitting}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>
      </div>
    </div>
  );
};

export default RolePagination;