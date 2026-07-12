// src/pages/admin/roles/AdminRoles.jsx
import React, { useState, useRef } from "react";
import { Shield, Plus, RefreshCw } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useRoles } from "./hooks/useRoles";
import { toast } from "react-toastify";
import Button from "../../../components/common/Button";

// Components
import RoleStats from "./components/RoleStats";
import RoleSearch from "./components/RoleSearch";
import RoleTable from "./components/RoleTable";
import RoleModal from "./components/RoleModal";
import RoleDetailView from "./components/RoleDetailView";
import RoleForm from "./components/RoleForm";
import DeleteConfirmationModal from "./components/DeleteConfirmationModal";
import RolePagination from "./components/RolePagination";
import RoleLoadingSkeleton from "./components/RoleLoadingSkeleton";

// Constants
import { DEFAULT_FORM_DATA, PAGE_LIMIT } from "./constants/roleConstants";
import { isSystemRole } from "./utils/roleHelpers";

const AdminRoles = () => {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("view");
  const [selectedRole, setSelectedRole] = useState(null);
  const [formData, setFormData] = useState(DEFAULT_FORM_DATA);
  const [formErrors, setFormErrors] = useState({});

  // Delete confirmation state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteType, setDeleteType] = useState("single");
  const [confirmText, setConfirmText] = useState("");

  // Custom hook
  const {
    roles,
    isLoading,
    searchTerm,
    setSearchTerm,
    currentPage,
    setCurrentPage,
    totalPages,
    selectedRoles,
    setSelectedRoles,
    isSubmitting,
    setIsSubmitting,
    fetchRoles,
    toggleActive,
    deleteRole,
    bulkDeleteRoles,
    createRole,
    updateRole,
    duplicateRole,
  } = useRoles();

  // ============================================
  // DELETE CONFIRMATION HANDLERS
  // ============================================

  const openDeleteConfirmation = (role) => {
    setDeleteTarget(role);
    setDeleteType("single");
    setConfirmText("");
    setShowDeleteModal(true);
  };

  const openBulkDeleteConfirmation = () => {
    setDeleteTarget(selectedRoles);
    setDeleteType("bulk");
    setConfirmText("");
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    if (deleteType === "single" && deleteTarget) {
      await deleteRole(deleteTarget.id, deleteTarget.name);
    } else if (deleteType === "bulk" && Array.isArray(deleteTarget)) {
      await bulkDeleteRoles(deleteTarget);
    }
    setShowDeleteModal(false);
    setDeleteTarget(null);
    setConfirmText("");
  };

  const handleDeleteClick = (role) => {
    if (isSystemRole(role.name)) {
      toast.warning(
        `Cannot delete the "${role.name}" role as it's a system role.`,
      );
      return;
    }
    openDeleteConfirmation(role);
  };

  // ============================================
  // MODAL HANDLERS
  // ============================================

  const handleView = (role) => {
    setSelectedRole(role);
    setModalType("view");
    setShowModal(true);
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
  };

  const handleCreate = () => {
    setFormData(DEFAULT_FORM_DATA);
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
      return false;
    }
    
    let success;
    if (modalType === "create") {
      success = await createRole(formData);
    } else {
      success = await updateRole(selectedRole.id, formData);
    }

    if (success) {
      setShowModal(false);
      setFormErrors({});
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

  const handleCopyName = (role) => {
    navigator.clipboard.writeText(role.name);
    toast.success("Role name copied to clipboard!");
  };

  const handleCopyId = (role) => {
    navigator.clipboard.writeText(role.id);
    toast.success("Role ID copied to clipboard!");
  };

  const handleViewUsers = (role) => {
    toast.info(`Viewing users with role: ${role.name}`);
  };

  // ============================================
  // PERMISSION CHECK
  // ============================================

  const canManageRoles =
    user?.permissions?.roles?.manage || user?.role === "admin";

  if (isLoading && roles.length === 0) {
    return <RoleLoadingSkeleton />;
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

  // ============================================
  // RENDER
  // ============================================

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

      {/* Stats */}
      <RoleStats roles={roles} />

      {/* Search */}
      <RoleSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* Table */}
      <RoleTable
        roles={roles}
        isLoading={isLoading}
        selectedRoles={selectedRoles}
        onSelectRows={setSelectedRoles}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDeleteClick}
        onToggleActive={toggleActive}
        onDuplicate={duplicateRole}
        onViewUsers={handleViewUsers}
        onCopyName={handleCopyName}
        onCopyId={handleCopyId}
        isSubmitting={isSubmitting}
      />

      {/* Pagination */}
      <RolePagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        totalItems={roles.length + (currentPage - 1) * PAGE_LIMIT}
        itemsPerPage={PAGE_LIMIT}
        isSubmitting={isSubmitting}
      />

      {/* Create/Edit/View Modal */}
      <RoleModal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={
          modalType === "create"
            ? "Create Role"
            : modalType === "edit"
              ? "Edit Role"
              : "Role Details"
        }
        modalType={modalType}
        isSubmitting={isSubmitting}
        onConfirm={modalType == "view" ? handleCloseModal : handleSubmit}
      >
        {modalType === "view" && selectedRole ? (
          <RoleDetailView role={selectedRole} />
        ) : (
          <RoleForm
            formData={formData}
            formErrors={formErrors}
            onChange={handleFormChange}
            isSubmitting={isSubmitting}
          />
        )}
      </RoleModal>

      {/* Delete Confirmation Modal */}
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
    </div>
  );
};

export default AdminRoles;
