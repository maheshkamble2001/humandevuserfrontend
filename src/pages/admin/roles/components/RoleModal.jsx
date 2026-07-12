// src/pages/admin/roles/components/RoleModal.jsx
import React from "react";
import AdminModal from "../../../../components/admin/AdminModal";

const RoleModal = ({
  isOpen,
  onClose,
  title,
  modalType,
  isSubmitting,
  children,
  onConfirm,
}) => {
  return (
    <AdminModal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="lg"
      confirmText={modalType === "view" ? "Close" : "Save"}
      showCancel={modalType !== "view"}
      onConfirm={onConfirm}
      confirmVariant={modalType === "view" ? "outline" : "gradient"}
      loading={isSubmitting}
    >
      {children}
    </AdminModal>
  );
};

export default RoleModal;