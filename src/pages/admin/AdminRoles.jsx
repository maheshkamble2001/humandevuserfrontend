// src/pages/admin/AdminRoles.jsx
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Plus,
  Crown,
  User,
  Users,
  CheckCircle,
  XCircle,
  RefreshCw,
  Search,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Pencil,
  Eye as EyeIcon,
  Trash2 as TrashIcon,
  MoreHorizontal,
  Star,
  StarOff,
  ShieldCheck,
  UserCog,
} from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { roleService } from "../../api/services/roleService";
import Button from "../../components/common/Button";
import Input from "../../components/common/Input";
import AdminModal from "../../components/admin/AdminModal";
import AdminTable from "../../components/admin/AdminTable";
import AdminStatsCard from "../../components/admin/AdminStatsCard";
import { toast } from "react-toastify";

const AdminRoles = () => {
  const { user } = useAuth();
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [bulkAction, setBulkAction] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showActionsMenu, setShowActionsMenu] = useState(null);

  // Delete Confirmation Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [confirmText, setConfirmText] = useState("");

  // Form state - Simplified
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    isActive: true,
  });

  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchRoles();
  }, [currentPage, searchTerm]);

  const fetchRoles = async () => {
    setIsLoading(true);
    try {
      const data = await roleService.getRoles({
        page: currentPage,
        limit: 20,
        search: searchTerm,
      });
      setRoles(data.roles || []);
      setTotalPages(data.totalPages || 1);
    } catch (error) {
      console.error("Error fetching roles:", error);
      toast.error(error.message || "Failed to load roles");
    } finally {
      setIsLoading(false);
    }
  };


  // ============================================
  // DELETE CONFIRMATION HANDLERS
  // ============================================

  const openDeleteConfirmation = (role) => {
    setDeleteTarget(role);
    setDeleteType("single");
    setConfirmText("");
    setShowDeleteModal(true);
    setShowActionsMenu(null);
  };

  const openBulkDeleteConfirmation = () => {
    setDeleteTarget(selectedRoles);
    setDeleteType("bulk");
    setConfirmText("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsSubmitting(true);

      if (deleteType === "single" && deleteTarget) {
        await roleService.deleteRole(deleteTarget.id);
        toast.success(`Role "${deleteTarget.name}" deleted successfully`);
        // Remove from local state
        setRoles((prev) => prev.filter((r) => r.id !== deleteTarget.id));
      } else if (deleteType === "bulk" && Array.isArray(deleteTarget)) {
        await roleService.bulkUpdateRoles({
          roleIds: deleteTarget,
          action: "delete",
        });
        toast.success(`Successfully deleted ${deleteTarget.length} roles`);
        // Remove from local state
        setRoles((prev) => prev.filter((r) => !deleteTarget.includes(r.id)));
        setSelectedRoles([]);
        setBulkAction("");
      }

      setShowDeleteModal(false);
      setDeleteTarget(null);
      setConfirmText("");
    } catch (error) {
      console.error("Error deleting role(s):", error);
      toast.error(error.response?.data?.error || error.message || "Failed to delete role(s)");
      // Refresh to fix any inconsistencies
      await fetchRoles();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (role) => {
    // Check if it's a system role
    if (role.name === "Admin" || role.name === "User") {
      toast.warning(
        `Cannot delete the "${role.name}" role as it's a system role.`,
      );
      return;
    }

    openDeleteConfirmation(role);
  };

  // ============================================
  // BULK ACTION HANDLER
  // ============================================
  const handleBulkAction = async () => {
    if (!bulkAction || selectedRoles.length === 0) return;

    if (bulkAction === "delete") {
      const criticalRoles = roles.filter(
        (r) =>
          selectedRoles.includes(r.id) &&
          (r.name === "Admin" || r.name === "User"),
      );

      if (criticalRoles.length > 0) {
        toast.warning(
          `Cannot delete system roles: ${criticalRoles.map((r) => r.name).join(", ")}`,
        );
        const nonCriticalIds = selectedRoles.filter(
          (id) => !criticalRoles.some((cr) => cr.id === id),
        );

        if (nonCriticalIds.length === 0) return;

        setSelectedRoles(nonCriticalIds);
        if (nonCriticalIds.length > 0) {
          openBulkDeleteConfirmation();
        }
        return;
      }

      openBulkDeleteConfirmation();
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to perform "${bulkAction}" on ${selectedRoles.length} roles?`,
      )
    )
      return;

    try {
      setIsSubmitting(true);
      await roleService.bulkUpdateRoles({
        roleIds: selectedRoles,
        action: bulkAction,
      });
      toast.success(
        `Successfully performed ${bulkAction} on ${selectedRoles.length} roles`,
      );
      setSelectedRoles([]);
      setBulkAction("");
      await fetchRoles();
    } catch (error) {
      console.error("Error performing bulk action:", error);
      toast.error(error.message || "Failed to perform bulk action");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // TOGGLE ACTIVE STATUS HANDLER
  // ============================================
  const handleToggleActive = async (role) => {
    console.log("Toggling role:", role);
    setShowActionsMenu(null);

    const originalRole = { ...role };
    const newStatus = !role.isActive;

    // Optimistic update
    setRoles((prevRoles) =>
      prevRoles.map((r) =>
        r.id === role.id ? { ...r, isActive: newStatus } : r,
      ),
    );

    try {
      const res = await roleService.updateRole(role.id, {
        name: role.name,
        description: role.description,
        isActive: newStatus,
      });

      if (res.code === 200) {
        toast.success(
          res.message ||
            `Role ${newStatus ? "activated" : "deactivated"} successfully`,
        );
      } else {
        // Rollback on error
        setRoles((prevRoles) =>
          prevRoles.map((r) => (r.id === role.id ? originalRole : r)),
        );
        toast.error(res.message || "Failed to update role status");
      }
    } catch (error) {
      // Rollback on error
      setRoles((prevRoles) =>
        prevRoles.map((r) => (r.id === role.id ? originalRole : r)),
      );
      console.error("Error toggling role status:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to toggle role status");
    }
  };

  // ============================================
  // ACTION HANDLERS
  // ============================================

  const handleView = (role) => {
    setSelectedRole(role);
    setModalType("view");
    setShowModal(true);
    setShowActionsMenu(null);
  };

  const handleEdit = (role) => {
    setSelectedRole(role);
    setFormData({
      name: role.name || "",
      description: role.description || "",
      isActive: role.isActive !== undefined ? role.isActive : true,
    });
    setFormErrors({});
    setModalType("edit");
    setShowModal(true);
    setShowActionsMenu(null);
  };

  const handleDuplicate = async (role) => {
    setShowActionsMenu(null);
    try {
      const newRole = {
        name: `${role.name} (Copy)`,
        description: role.description,
        isActive: true,
      };

      await roleService.createRole(newRole);
      toast.success("Role duplicated successfully!");
      await fetchRoles();
    } catch (error) {
      console.error("Error duplicating role:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to duplicate role");
    }
  };

  const handleViewUsers = (role) => {
    setShowActionsMenu(null);
    toast.info(`Viewing users with role: ${role.name}`);
  };

  const handleCopyName = (role) => {
    setShowActionsMenu(null);
    navigator.clipboard.writeText(role.name);
    toast.success("Role name copied to clipboard!");
  };

  const handleCopyId = (role) => {
    setShowActionsMenu(null);
    navigator.clipboard.writeText(role.id);
    toast.success("Role ID copied to clipboard!");
  };

  // ============================================
  // CREATE/UPDATE
  // ============================================
  const handleCreate = () => {
    setFormData({
      name: "",
      description: "",
      isActive: true,
    });
    setFormErrors({});
    setModalType("create");
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const errors = {};
    if (!formData.name.trim()) errors.name = "Name is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      toast.error("Please fix form errors");
      return;
    }

    try {
      setIsSubmitting(true);
      if (modalType === "create") {
        await roleService.createRole(formData);
        toast.success("Role created successfully!");
      } else {
        await roleService.updateRole(selectedRole.id, formData);
        toast.success("Role updated successfully!");
      }

      setShowModal(false);
      await fetchRoles();
    } catch (error) {
      console.error("Error saving role:", error);
      
      if (error.response?.data?.error) {
        toast.error(error.response.data.error);
      } else if (error.errors && Array.isArray(error.errors)) {
        const validationErrors = {};
        error.errors.forEach((err) => {
          validationErrors[err.field] = err.message;
        });
        setFormErrors(validationErrors);
        toast.error("Please fix validation errors");
      } else {
        toast.error(error.message || "Failed to save role");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // ============================================
  // FORM HANDLERS
  // ============================================
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFormErrors({});
  };

  // ============================================
  // TABLE COLUMNS
  // ============================================
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
          {/* Status Indicator */}
          <div className="flex items-center gap-1.5">
            {value ? (
              <>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-xs text-green-400 font-medium">
                  Active
                </span>
              </>
            ) : (
              <>
                <div className="w-2 h-2 bg-gray-500 rounded-full" />
                <span className="text-xs text-gray-500">Inactive</span>
              </>
            )}
          </div>

          {/* Toggle Switch */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleToggleActive(row);
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
      render: (value, row) => (
        <div className="flex items-center gap-1.5">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleView(row);
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
              handleEdit(row);
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
              handleDeleteClick(row);
            }}
            className="p-1.5 hover:bg-white/10 rounded-lg transition group"
            title="Delete Role"
            disabled={isSubmitting || row.name === "Admin" || row.name === "User"}
          >
            <TrashIcon className={`w-4 h-4 ${row.name === "Admin" || row.name === "User" ? "text-gray-500 cursor-not-allowed" : "text-red-400 group-hover:text-red-300"} transition`} />
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
                      handleDuplicate(row);
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
                      handleViewUsers(row);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                    disabled={isSubmitting}
                  >
                    <Users className="w-4 h-4" />
                    View Users
                  </button>
                  <button
                    onClick={() => {
                      handleCopyName(row);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-gray-300 hover:bg-white/5 transition"
                    disabled={isSubmitting}
                  >
                    <CopyIcon className="w-4 h-4" />
                    Copy Name
                  </button>
                  <button
                    onClick={() => {
                      handleCopyId(row);
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
      ),
    },
  ];

  const getRoleIcon = (roleName) => {
    const icons = {
      Admin: Crown,
      User: User,
      Moderator: Shield,
      Guest: User,
    };
    return icons[roleName] || Shield;
  };

  // ============================================
  // PERMISSION CHECK
  // ============================================
  const canManageRoles =
    user?.permissions?.roles?.manage || user?.role === "admin";

  if (isLoading && roles.length === 0) {
    return <AdminLoadingSkeleton />;
  }

  if (!canManageRoles) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <Shield className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white">Access Denied</h2>
          <p className="text-gray-400 mt-2">
            You don't have permission to manage roles.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Role Management</h1>
          <p className="text-gray-400">Manage user roles and permissions</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="small"
            icon={RefreshCw}
            onClick={fetchRoles}
            disabled={isSubmitting}
          >
            Refresh
          </Button>
          <Button
            variant="gradient"
            size="small"
            icon={Plus}
            onClick={handleCreate}
            disabled={isSubmitting}
          >
            Create Role
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatsCard
          icon={Shield}
          label="Total Roles"
          value={roles.filter((r) => !r.isDeleted).length || 0}
          color="primary"
        />
        <AdminStatsCard
          icon={CheckCircle}
          label="Active Roles"
          value={roles.filter((r) => r.isActive && !r.isDeleted).length || 0}
          color="success"
        />
        <AdminStatsCard
          icon={Crown}
          label="Admin Roles"
          value={roles.filter((r) => r.name === "Admin" && !r.isDeleted).length || 0}
          color="warning"
        />
        <AdminStatsCard
          icon={Users}
          label="Total Users with Roles"
          value={roles.reduce((sum, r) => sum + (r.userCount || 0), 0) || 0}
          color="info"
        />
      </div>

      {/* Search */}
      <div className="glass-effect rounded-xl p-4 border border-white/20">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <Input
              icon={Search}
              placeholder="Search roles by name or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Roles Table */}
      <AdminTable
        columns={columns}
        data={roles.filter((r) => !r.isDeleted)}
        isLoading={isLoading}
        selectedRows={selectedRoles}
        onSelectRows={setSelectedRoles}
        showActions={false}
        showView={false}
        showEdit={false}
        showDelete={false}
        showCopy={false}
        striped={true}
        hoverable={true}
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-400">
            Showing {(currentPage - 1) * 20 + 1} -{" "}
            {Math.min(currentPage * 20, roles.length + (currentPage - 1) * 20)}{" "}
            of {roles.length + (currentPage - 1) * 20} roles
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={currentPage === 1 || isSubmitting}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4 text-gray-400" />
            </button>
            <span className="px-3 py-2 text-sm text-gray-400">
              {currentPage} / {totalPages}
            </span>
            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={currentPage === totalPages || isSubmitting}
              className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
      )}

      {/* Create/Edit/View Modal */}
      <AdminModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          modalType === "create"
            ? "Create Role"
            : modalType === "edit"
              ? "Edit Role"
              : "Role Details"
        }
        size="lg"
        confirmText={modalType === "view" ? "Close" : "Save"}
        showCancel={modalType !== "view"}
        onConfirm={modalType === "view" ? handleCloseModal : handleSubmit}
        confirmVariant={modalType === "view" ? "outline" : "gradient"}
        loading={isSubmitting}
      >
        {modalType === "view" && selectedRole ? (
          <RoleDetailView role={selectedRole} onClose={handleCloseModal} />
        ) : (
          <RoleForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            isEdit={modalType === "edit"}
            onClose={handleCloseModal}
            isSubmitting={isSubmitting}
          />
        )}
      </AdminModal>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <DeleteConfirmationModal
            isOpen={showDeleteModal}
            onClose={() => {
              setShowDeleteModal(false);
              setDeleteTarget(null);
              setConfirmText("");
            }}
            onConfirm={handleConfirmDelete}
            target={deleteTarget}
            type={deleteType}
            isSubmitting={isSubmitting}
            confirmText={confirmText}
            setConfirmText={setConfirmText}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// DELETE CONFIRMATION MODAL
// ============================================
const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  target,
  type,
  isSubmitting,
  confirmText,
  setConfirmText,
}) => {
  const isSingleDelete = type === "single";
  const isDangerous =
    isSingleDelete &&
    (target?.name === "Admin" || target?.name === "User");

  const isConfirmEnabled = isSingleDelete
    ? confirmText === target?.name
    : confirmText === "DELETE";

  if (isDangerous) {
    return (
      <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
        <div className="bg-dark-800 rounded-xl max-w-md w-full border border-red-500/20 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-full">
              <Shield className="w-6 h-6 text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-white">
              Cannot Delete System Role
            </h3>
          </div>
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <p className="text-red-400">
              <strong>"{target?.name}"</strong> is a system role and cannot be
              deleted.
            </p>
            <p className="text-sm text-gray-400 mt-2">
              System roles are required for the platform to function properly.
            </p>
          </div>
          <Button variant="gradient" className="w-full" onClick={onClose}>
            Got it
          </Button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-md w-full border border-red-500/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start gap-3 mb-4">
            <div className="p-2 bg-red-500/20 rounded-full flex-shrink-0">
              <AlertTriangle className="w-6 h-6 text-red-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">
                {isSingleDelete ? "Delete Role" : "Delete Multiple Roles"}
              </h3>
              <p className="text-sm text-gray-400 mt-1">
                {isSingleDelete
                  ? `You are about to delete the role "${target?.name}".`
                  : `You are about to delete ${target?.length || 0} roles.`}
              </p>
            </div>
          </div>

          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg mb-4">
            <p className="text-sm text-red-400">
              <strong>Warning:</strong> This action cannot be undone. All users
              with this role will lose their permissions.
            </p>
            {isSingleDelete && target?.userCount > 0 && (
              <p className="text-sm text-yellow-400 mt-2">
                ⚠️ This role is currently assigned to {target.userCount} user
                {target.userCount > 1 ? "s" : ""}.
              </p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-300 mb-2">
              {isSingleDelete ? (
                <>
                  Type <strong className="text-red-400">{target?.name}</strong>{" "}
                  to confirm:
                </>
              ) : (
                <>
                  Type <strong className="text-red-400">DELETE</strong> to
                  confirm:
                </>
              )}
            </p>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder={
                isSingleDelete ? `Type "${target?.name}"` : 'Type "DELETE"'
              }
              className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-red-500"
              autoFocus
            />
          </div>

          <div className="flex gap-3">
            <Button
              variant="danger"
              className="flex-1"
              onClick={onConfirm}
              loading={isSubmitting}
              disabled={!isConfirmEnabled || isSubmitting}
            >
              {isSingleDelete ? "Delete Role" : "Delete Roles"}
            </Button>
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// ============================================
// ROLE DETAIL VIEW COMPONENT
// ============================================
const RoleDetailView = ({ role, onClose }) => {
  const Icon = getRoleIcon(role.name);
  
  // Define permissions based on role name
  const getPermissions = (roleName) => {
    const permissions = {
      read: false,
      write: false,
      delete: false,
      manage: false,
      users: false,
      content: false,
      settings: false,
    };

    if (roleName === "Admin") {
      permissions.read = true;
      permissions.write = true;
      permissions.delete = true;
      permissions.manage = true;
      permissions.users = true;
      permissions.content = true;
      permissions.settings = true;
    } else if (roleName === "Moderator") {
      permissions.read = true;
      permissions.write = true;
      permissions.delete = true;
      permissions.users = true;
      permissions.content = true;
    } else if (roleName === "User") {
      permissions.read = true;
      permissions.write = true;
    } else if (roleName === "Guest") {
      permissions.read = true;
    }

    return permissions;
  };

  const permissionLabels = {
    read: "Read",
    write: "Write",
    delete: "Delete",
    manage: "Manage",
    users: "Users",
    content: "Content",
    settings: "Settings",
  };

  // const permissions = getPermissions(role.name);

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
        <h4 className="text-sm font-medium text-white mb-2">
          Users with this role
        </h4>
        <p className="text-sm text-gray-400">{role.userCount || 0} users</p>
      </div>

      <div className="p-4 bg-white/5 rounded-lg">
        <h4 className="text-sm font-medium text-white mb-2">Added On</h4>
        <p className="text-sm text-gray-400">
          {role.addedOn ? new Date(role.addedOn).toLocaleString() : "N/A"}
        </p>
      </div>
    </div>
  );
};

// ============================================
// ROLE FORM COMPONENT
// ============================================
const RoleForm = ({
  formData,
  formErrors,
  onChange,
  isEdit,
  onClose,
  isSubmitting = false,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Role Name"
          name="name"
          value={formData.name}
          onChange={onChange}
          error={formErrors.name}
          placeholder="Enter role name"
          required
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1.5">
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={onChange}
          rows="3"
          className="w-full bg-white/5 rounded-lg px-4 py-2.5 text-white placeholder-gray-400 border border-white/10 focus:outline-none focus:ring-2 focus:ring-primary-500"
          placeholder="Describe the role..."
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={onChange}
            className="w-4 h-4 bg-white/5 border border-white/20 rounded focus:ring-primary-500"
            disabled={isSubmitting}
          />
          <span className="text-sm text-gray-300">Active</span>
        </label>
      </div>
    </div>
  );
};

// ============================================
// HELPER FUNCTIONS
// ============================================
const getRoleIcon = (roleName) => {
  const icons = {
    Admin: Crown,
    User: User,
    Moderator: Shield,
    Guest: User,
  };
  return icons[roleName] || Shield;
};

// ============================================
// LOADING SKELETON
// ============================================
const AdminLoadingSkeleton = () => (
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

export default AdminRoles;