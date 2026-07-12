// src/pages/admin/roles/components/RoleDetailView.jsx
import React from "react";
import { CheckCircle, XCircle, Users } from "lucide-react";
import { getRoleIcon, getPermissions, formatDate } from "../utils/roleHelpers";
import { PERMISSION_LABELS } from "../constants/roleConstants";

const RoleDetailView = ({ role }) => {
  const Icon = getRoleIcon(role.name);
  const permissions = getPermissions(role.name);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="p-3 rounded-2xl bg-primary-500/20">
          <Icon className="w-10 h-10 text-primary-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">{role.name}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-sm text-gray-400">
              {role.description || "No description"}
            </span>
            <span className="text-xs text-gray-400">•</span>
            <span
              className={`text-sm ${role.isActive ? "text-green-400" : "text-gray-400"}`}
            >
              {role.isActive ? "Active" : "Inactive"}
            </span>
          </div>
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <p className="text-gray-300">
          {role.description || "No description provided"}
        </p>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-3">Permissions</h4>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(PERMISSION_LABELS).map(([key, label]) => (
            <div
              key={key}
              className="flex items-center gap-2 p-2 bg-white/5 rounded-lg"
            >
              {permissions[key] ? (
                <CheckCircle className="w-4 h-4 text-green-400" />
              ) : (
                <XCircle className="w-4 h-4 text-gray-400" />
              )}
              <span className="text-sm text-gray-300">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">
          Users with this role
        </h4>
        <p className="text-sm text-gray-400">{role.userCount || 0} users</p>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Added On</h4>
        <p className="text-sm text-gray-400">{formatDate(role.addedOn)}</p>
      </div>
    </div>
  );
};

export default RoleDetailView;