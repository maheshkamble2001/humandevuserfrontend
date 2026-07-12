// src/pages/admin/roles/components/DeleteConfirmationModal.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, AlertTriangle } from "lucide-react";
import Button from "../../../../components/common/Button";
import { isSystemRole } from "../utils/roleHelpers";

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
  const isDangerous = isSingleDelete && isSystemRole(target?.name);

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
    <AnimatePresence>
      {isOpen && (
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
      )}
    </AnimatePresence>
  );
};

export default DeleteConfirmationModal;