// src/pages/admin/roles/constants/roleConstants.js

export const PERMISSION_LABELS = {
  read: "Read",
  write: "Write",
  delete: "Delete",
  manage: "Manage",
  users: "Users",
  content: "Content",
  settings: "Settings",
};

export const ROLE_ICONS = {
  Admin: "Crown",
  User: "User",
  Moderator: "Shield",
  Guest: "User",
};

export const DEFAULT_PERMISSIONS = {
  read: false,
  write: false,
  delete: false,
  manage: false,
  users: false,
  content: false,
  settings: false,
};

export const SYSTEM_ROLES = ["Admin", "User"];

export const DEFAULT_FORM_DATA = {
  name: "",
  description: "",
  isActive: true,
};

export const PAGE_LIMIT = 20;

// ✅ Validation Rules
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 2,
    maxLength: 50,
    pattern: /^[a-zA-Z0-9\s\-_()]+$/,
    patternMessage: "Name can only contain letters, numbers, spaces, hyphens, underscores, and parentheses",
    reservedNames: ["Admin", "User", "Moderator", "Guest"],
    reservedMessage: "This role name is reserved",
  },
  description: {
    required: false,
    maxLength: 500,
  },
  isActive: {
    required: false,
  },
};

// ✅ Validation Messages
export const VALIDATION_MESSAGES = {
  name: {
    required: "Role name is required",
    minLength: "Role name must be at least 2 characters",
    maxLength: "Role name cannot exceed 50 characters",
    pattern: "Role name contains invalid characters",
    reserved: "This role name is reserved and cannot be used",
    duplicate: "A role with this name already exists",
  },
  description: {
    maxLength: "Description cannot exceed 500 characters",
  },
};