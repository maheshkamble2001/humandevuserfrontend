// src/pages/admin/roles/utils/roleHelpers.js
import { Shield, Crown, User, Users } from "lucide-react";

export const getRoleIcon = (roleName) => {
  const icons = {
    Admin: Crown,
    User: User,
    Moderator: Shield,
    Guest: User,
  };
  return icons[roleName] || Shield;
};

export const getPermissions = (roleName) => {
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

export const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return `${d.toLocaleDateString()} ${d.toLocaleTimeString()}`;
};

export const isSystemRole = (roleName) => {
  return ["Admin", "User"].includes(roleName);
};