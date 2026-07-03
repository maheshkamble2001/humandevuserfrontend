// src/api/services/roleService.js
import BaseService from './baseService'; // ✅ Default import
import { endpoints } from '../endpoints';

class RoleService extends BaseService {
  constructor() {
    super(endpoints.admin.roles);
  }

  // ============================================
  // ROLE CRUD OPERATIONS
  // ============================================

  /**
   * Get all roles with pagination and search
   * @param {Object} params - Query parameters
   * @param {number} params.page - Page number
   * @param {number} params.limit - Items per page
   * @param {string} params.search - Search term
   * @returns {Promise<Object>} Roles data with pagination
   */
  async getRoles(params = {}) {
    return this.get(endpoints.admin.roles, params);
  }

  /**
   * Get a single role by ID
   * @param {string} id - Role ID
   * @returns {Promise<Object>} Role data
   */
  async getRole(id) {
    return this.get(endpoints.admin.role(id));
  }

  /**
   * Create a new role
   * @param {Object} data - Role data
   * @param {string} data.name - Role name
   * @param {string} data.slug - Role slug
   * @param {string} data.description - Role description
   * @param {Object} data.permissions - Role permissions
   * @param {number} data.level - Role level
   * @param {number} data.priority - Role priority
   * @param {string} data.color - Role color
   * @param {string} data.icon - Role icon
   * @param {boolean} data.isDefault - Is default role
   * @param {boolean} data.isActive - Is active
   * @returns {Promise<Object>} Created role
   */
  async createRole(data) {
    return this.post(endpoints.admin.roles, data);
  }

  /**
   * Update an existing role
   * @param {string} id - Role ID
   * @param {Object} data - Updated role data
   * @returns {Promise<Object>} Updated role
   */
  async updateRole(id, data) {
    return this.put(endpoints.admin.role(id), data);
  }

  /**
   * Delete a role
   * @param {string} id - Role ID
   * @returns {Promise<Object>} Deletion response
   */
  async deleteRole(id) {
    return this.delete(endpoints.admin.role(id));
  }

  // ============================================
  // PERMISSION MANAGEMENT
  // ============================================

  /**
   * Get permissions structure
   * @returns {Promise<Object>} Permissions structure
   */
  async getPermissionsStructure() {
    return this.get(endpoints.admin.permissionsStructure);
  }

  /**
   * Get permissions for a specific role
   * @param {string} id - Role ID
   * @returns {Promise<Object>} Role permissions
   */
  async getRolePermissions(id) {
    return this.get(endpoints.admin.rolePermissions(id));
  }

  /**
   * Update permissions for a specific role
   * @param {string} id - Role ID
   * @param {Object} permissions - Updated permissions
   * @returns {Promise<Object>} Updated permissions
   */
  async updateRolePermissions(id, permissions) {
    return this.put(endpoints.admin.rolePermissions(id), { permissions });
  }

  // ============================================
  // ROLE ASSIGNMENT
  // ============================================

  /**
   * Assign a role to a user
   * @param {Object} data - Assignment data
   * @param {string} data.userId - User ID
   * @param {string} data.roleId - Role ID
   * @returns {Promise<Object>} Assignment response
   */
  async assignRole(data) {
    return this.post(endpoints.admin.assignRole, data);
  }

  /**
   * Get users with a specific role
   * @param {string} roleId - Role ID
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>} Users with role
   */
  async getUsersByRole(roleId, params = {}) {
    return this.get(`${endpoints.admin.role(roleId)}/users`, params);
  }

  // ============================================
  // BULK OPERATIONS
  // ============================================

  /**
   * Bulk assign roles to multiple users
   * @param {Object} data - Bulk assignment data
   * @param {string[]} data.userIds - Array of user IDs
   * @param {string} data.roleId - Role ID to assign
   * @returns {Promise<Object>} Bulk assignment response
   */
  async bulkAssignRole(data) {
    return this.post(`${endpoints.admin.roles}/bulk-assign`, data);
  }

  /**
   * Bulk delete roles
   * @param {string[]} roleIds - Array of role IDs
   * @returns {Promise<Object>} Bulk deletion response
   */
  async bulkDeleteRoles(roleIds) {
    return this.post(`${endpoints.admin.roles}/bulk-delete`, { roleIds });
  }

  /**
   * Bulk update roles (activate/deactivate)
   * @param {Object} data - Bulk update data
   * @param {string[]} data.roleIds - Array of role IDs
   * @param {string} data.action - Action to perform (activate/deactivate)
   * @returns {Promise<Object>} Bulk update response
   */
  async bulkUpdateRoles(data) {
    return this.post(`${endpoints.admin.roles}/bulk-update`, data);
  }

  // ============================================
  // ROLE TEMPLATES
  // ============================================

  /**
   * Get role templates (predefined roles)
   * @returns {Promise<Object>} Role templates
   */
  async getRoleTemplates() {
    return this.get(`${endpoints.admin.roles}/templates`);
  }

  /**
   * Create a role from template
   * @param {string} templateId - Template ID
   * @param {Object} customizations - Customizations to apply
   * @returns {Promise<Object>} Created role
   */
  async createRoleFromTemplate(templateId, customizations = {}) {
    return this.post(`${endpoints.admin.roles}/from-template`, { templateId, ...customizations });
  }

  // ============================================
  // ROLE VALIDATION
  // ============================================

  /**
   * Validate role data
   * @param {Object} data - Role data to validate
   * @returns {Promise<Object>} Validation result
   */
  async validateRole(data) {
    return this.post(`${endpoints.admin.roles}/validate`, data);
  }

  /**
   * Check if role slug is available
   * @param {string} slug - Role slug to check
   * @param {string} excludeId - Role ID to exclude (for updates)
   * @returns {Promise<Object>} Availability result
   */
  async checkSlugAvailability(slug, excludeId = null) {
    return this.post(`${endpoints.admin.roles}/check-slug`, { slug, excludeId });
  }

  // ============================================
  // ROLE STATISTICS
  // ============================================

  /**
   * Get role statistics
   * @returns {Promise<Object>} Role statistics
   */
  async getRoleStats() {
    return this.get(`${endpoints.admin.roles}/stats`);
  }

  /**
   * Get role distribution across users
   * @returns {Promise<Object>} Role distribution
   */
  async getRoleDistribution() {
    return this.get(`${endpoints.admin.roles}/distribution`);
  }

  // ============================================
  // CUSTOM PERMISSIONS
  // ============================================

  /**
   * Get all available permissions
   * @returns {Promise<Object>} Available permissions
   */
  async getAvailablePermissions() {
    return this.get(`${endpoints.admin.roles}/permissions/all`);
  }

  /**
   * Get permission groups
   * @returns {Promise<Object>} Permission groups
   */
  async getPermissionGroups() {
    return this.get(`${endpoints.admin.roles}/permissions/groups`);
  }

  /**
   * Get permissions for current user
   * @returns {Promise<Object>} Current user permissions
   */
  async getMyPermissions() {
    return this.get(`${endpoints.admin.roles}/my-permissions`);
  }
}

// ✅ Export as default and named export
export const roleService = new RoleService();
export default roleService;