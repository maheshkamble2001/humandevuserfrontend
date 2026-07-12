// src/pages/admin/roles/hooks/useRoles.js
import { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { roleService } from "../../../../api/services/roleService";
import { PAGE_LIMIT } from "../constants/roleConstants";

export const useRoles = () => {
  const [roles, setRoles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchRoles = useCallback(async () => {
    setIsLoading(true);
    try {
      const data = await roleService.getRoles({
        page: currentPage,
        limit: PAGE_LIMIT,
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
  }, [currentPage, searchTerm]);

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  const toggleActive = useCallback(async (role) => {
    const originalRole = { ...role };
    const newStatus = !role.isActive;

    setRoles((prev) =>
      prev.map((r) => (r.id === role.id ? { ...r, isActive: newStatus } : r))
    );

    try {
      const res = await roleService.updateRole(role.id, {
        name: role.name,
        description: role.description,
        isActive: newStatus,
      });

      if (res.code === 200) {
        toast.success(res.message || `Role ${newStatus ? "activated" : "deactivated"} successfully`);
      } else {
        setRoles((prev) => prev.map((r) => (r.id === role.id ? originalRole : r)));
        toast.error(res.message || "Failed to update role status");
      }
    } catch (error) {
      setRoles((prev) => prev.map((r) => (r.id === role.id ? originalRole : r)));
      console.error("Error toggling role status:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to toggle role status");
    }
  }, []);

  const deleteRole = useCallback(async (roleId, roleName) => {
    setIsSubmitting(true);
    try {
      await roleService.deleteRole(roleId);
      setRoles((prev) => prev.filter((r) => r.id !== roleId));
      toast.success(`Role "${roleName}" deleted successfully`);
      return true;
    } catch (error) {
      console.error("Error deleting role:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to delete role");
      await fetchRoles();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchRoles]);

  const bulkDeleteRoles = useCallback(async (roleIds) => {
    setIsSubmitting(true);
    try {
      await roleService.bulkUpdateRoles({
        roleIds,
        action: "delete",
      });
      setRoles((prev) => prev.filter((r) => !roleIds.includes(r.id)));
      toast.success(`Successfully deleted ${roleIds.length} roles`);
      setSelectedRoles([]);
      return true;
    } catch (error) {
      console.error("Error bulk deleting roles:", error);
      toast.error(error.message || "Failed to delete roles");
      await fetchRoles();
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchRoles]);

  const createRole = useCallback(async (formData) => {
    setIsSubmitting(true);
    try {
      await roleService.createRole(formData);
      toast.success("Role created successfully!");
      await fetchRoles();
      return true;
    } catch (error) {
      console.error("Error creating role:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to create role");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchRoles]);

  const updateRole = useCallback(async (roleId, formData) => {
    setIsSubmitting(true);
    try {
      await roleService.updateRole(roleId, formData);
      toast.success("Role updated successfully!");
      await fetchRoles();
      return true;
    } catch (error) {
      console.error("Error updating role:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to update role");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchRoles]);

  const duplicateRole = useCallback(async (role) => {
    setIsSubmitting(true);
    try {
      const newRole = {
        name: `${role.name} (Copy)`,
        description: role.description,
        isActive: true,
      };
      await roleService.createRole(newRole);
      toast.success("Role duplicated successfully!");
      await fetchRoles();
      return true;
    } catch (error) {
      console.error("Error duplicating role:", error);
      toast.error(error.response?.data?.error || error.message || "Failed to duplicate role");
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [fetchRoles]);

  return {
    // State
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

    // Actions
    fetchRoles,
    toggleActive,
    deleteRole,
    bulkDeleteRoles,
    createRole,
    updateRole,
    duplicateRole,
  };
};