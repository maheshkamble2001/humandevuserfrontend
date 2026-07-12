// src/pages/admin/roles/components/RoleStats.jsx
import React from "react";
import { Shield, CheckCircle, Crown, Users } from "lucide-react";
import AdminStatsCard from "../../../../components/admin/AdminStatsCard";

const RoleStats = ({ roles }) => {
  const totalRoles = roles.filter((r) => !r.isDeleted).length || 0;
  const activeRoles = roles.filter((r) => r.isActive && !r.isDeleted).length || 0;
  const adminRoles = roles.filter((r) => r.name === "Admin" && !r.isDeleted).length || 0;
  const totalUsers = roles.reduce((sum, r) => sum + (r.userCount || 0), 0) || 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <AdminStatsCard
        icon={Shield}
        label="Total Roles"
        value={totalRoles}
        color="primary"
      />
      <AdminStatsCard
        icon={CheckCircle}
        label="Active Roles"
        value={activeRoles}
        color="success"
      />
      <AdminStatsCard
        icon={Crown}
        label="Admin Roles"
        value={adminRoles}
        color="warning"
      />
      <AdminStatsCard
        icon={Users}
        label="Total Users with Roles"
        value={totalUsers}
        color="info"
      />
    </div>
  );
};

export default RoleStats;