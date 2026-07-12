// src/pages/admin/roles/components/RoleTable.jsx
import React, { useState } from "react";
import {
  Eye as EyeIcon,
  Pencil,
  Trash2 as TrashIcon,
  MoreHorizontal,
  Star,
  Users,
  CopyIcon,
} from "lucide-react";
import AdminTable from "../../../../components/admin/AdminTable";
import { getRoleIcon, isSystemRole } from "../utils/roleHelpers";
import { SYSTEM_ROLES } from "../constants/roleConstants";

const RoleTable = ({
  roles,
  isLoading,
  selectedRoles,
  onSelectRows,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
  onDuplicate,
  onViewUsers,
  onCopyName,
  onCopyId,
  isSubmitting,
}) => {
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  const columns = [
    {
      key: "name",
      label: "Role Name",
      sortable: true,
      render: (value, row) => {
        const Icon = getRoleIcon(row.name);
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 bg-primary-500/20">
              <Icon className="w-5 h-5 text-primary-400" />
            </div>
            <div>
              <p className="font-medium text-white">{value}</p>
              {row.description && (
                <p className="text-xs text-gray-400 truncate max-w-[200px]">
                  {row.description}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      key: "userCount",
      label: "Users",
      sortable: true,
      render: (value) => (
        <div className="flex items-center gap-1.5">
          <Users className="w-4 h-4 text-blue-400" />
          <span className="font-medium text-white">{value || 0}</span>
          <span className="text-xs text-gray-400">users</span>
        </div>
      ),
    },
    {
      key: "isActive",
      label: "Active",
      sortable: true,
      render: (value, row) => (
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            {value ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">Active</span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span className="text-xs text-gray-500">Inactive</span>
              </>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleActive(row);
            }}
            disabled={isSubmitting}
            className={`
              relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent 
              transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-500
              ${value ? "bg-primary-500" : "bg-gray-600"}
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}
            `}
            role="switch"
            aria-checked={value}
          >
            <span
              className={`
                pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-lg 
                transition duration-200 ease-in-out
                ${value ? "translate-x-5" : "translate-x-0"}
              `}
            />
          </button>
        </div>
      ),
    },
    {
      key: "addedOn",
      label: "Added On",
      sortable: true,
      render: (value) => {
        if (!value) return <span className="text-gray-500">-</span>;
        const date = new Date(value);
        return (
          <span className="text-sm text-gray-300">
            {date.toLocaleDateString()} {date.toLocaleTimeString()}
          </span>
        );
      },
    },
    {
      key: "actions",
      label: "Actions",
      sortable: false,
      render: (value, row) => {
        const isSystem = isSystemRole(row.name);
        return (
          <div className="flex items-center gap-1.5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onView(row);
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition group"
              title="View Role"
              disabled={isSubmitting}
            >
              <EyeIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(row);
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition group"
              title="Edit Role"
              disabled={isSubmitting}
            >
              <Pencil className="w-4 h-4 text-blue-400 group-hover:text-blue-300 transition" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(row);
              }}
              className="p-1.5 hover:bg-white/10 rounded-lg transition group"
              title="Delete Role"
              disabled={isSubmitting || isSystem}
            >
              <TrashIcon
                className={`w-4 h-4 ${
                  isSystem
                    ? "text-gray-500 cursor-not-allowed"
                    : "text-red-400 group-hover:text-red-300"
                } transition`}
              />
            </button>

            {/* More Actions Dropdown */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowActionsMenu(showActionsMenu === row.id ? null : row.id);
                }}
                className="p-1.5 hover:bg-white/10 rounded-lg transition group"
                title="More Actions"
                disabled={isSubmitting}
              >
                <MoreHorizontal className="w-4 h-4 text-gray-400 group-hover:text-white transition" />
              </button>

              {showActionsMenu === row.id && (
                <div className="absolute right-0 mt-1 w-48 bg-dark-800 rounded-lg shadow-xl border border-white/10 overflow-hidden z-50">
                  <div className="py-1">
                    <button
                      onClick={() => {
                        onDuplicate(row);
                        setShowActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                      disabled={isSubmitting}
                    >
                      <Star className="w-4 h-4" />
                      Duplicate Role
                    </button>
                    <div className="border-t border-white/10 my-1"></div>
                    <button
                      onClick={() => {
                        onViewUsers(row);
                        setShowActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                      disabled={isSubmitting}
                    >
                      <Users className="w-4 h-4" />
                      View Users
                    </button>
                    <button
                      onClick={() => {
                        onCopyName(row);
                        setShowActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                      disabled={isSubmitting}
                    >
                      <CopyIcon className="w-4 h-4" />
                      Copy Name
                    </button>
                    <button
                      onClick={() => {
                        onCopyId(row);
                        setShowActionsMenu(null);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                      disabled={isSubmitting}
                    >
                      <CopyIcon className="w-4 h-4" />
                      Copy ID
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <AdminTable
      columns={columns}
      data={roles.filter((r) => !r.isDeleted)}
      isLoading={isLoading}
      selectedRows={selectedRoles}
      onSelectRows={onSelectRows}
      showActions={false}
      showView={false}
      showEdit={false}
      showDelete={false}
      showCopy={false}
      striped={true}
      hoverable={true}
    />
  );
};

export default RoleTable;