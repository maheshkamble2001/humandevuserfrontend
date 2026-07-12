// src/pages/admin/roles/components/RoleLoadingSkeleton.jsx
import React from "react";

const RoleLoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-white/5 rounded"></div>
    </div>
    <div className="grid grid-cols-4 gap-4">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="h-32 bg-white/5 rounded-xl"></div>
      ))}
    </div>
    <div className="h-16 bg-white/5 rounded-xl"></div>
    <div className="h-96 bg-white/5 rounded-xl"></div>
  </div>
);

export default RoleLoadingSkeleton;