// src/api/services/adminService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class AdminService extends BaseService {
  constructor() {
    super(endpoints.admin.users);
  }

  // Dashboard
  async getStats() {
    return this.get(endpoints.admin.stats);
  }

  // Users
  async getUsers(params) {
    return this.get(endpoints.admin.users, params);
  }

  async getUser(id) {
    return this.get(endpoints.admin.user(id));
  }

  async updateUser(id, data) {
    return this.put(endpoints.admin.user(id), data);
  }

  async deleteUser(id) {
    return this.delete(endpoints.admin.user(id));
  }

  async bulkUserAction(data) {
    return this.post(endpoints.admin.bulkUsers, data);
  }

  async getUserActivity(id, params) {
    return this.get(endpoints.admin.activity(id), params);
  }

  // Roles
  async getRoles(params) {
    return this.get(endpoints.admin.roles, params);
  }

  async getRole(id) {
    return this.get(endpoints.admin.role(id));
  }

  async createRole(data) {
    return this.post(endpoints.admin.roles, data);
  }

  async updateRole(id, data) {
    return this.put(endpoints.admin.role(id), data);
  }

  async deleteRole(id) {
    return this.delete(endpoints.admin.role(id));
  }

  async getRolePermissions(id) {
    return this.get(endpoints.admin.rolePermissions(id));
  }

  async updateRolePermissions(id, permissions) {
    return this.put(endpoints.admin.rolePermissions(id), { permissions });
  }

  async getPermissionsStructure() {
    return this.get(endpoints.admin.permissionsStructure);
  }

  async assignRole(data) {
    return this.post(endpoints.admin.assignRole, data);
  }

  // Content - Missions
  async getAdminMissions(params) {
    return this.get(endpoints.admin.missions, params);
  }

  async getAdminMission(id) {
    return this.get(endpoints.admin.mission(id));
  }

  async createAdminMission(data) {
    return this.post(endpoints.admin.missions, data);
  }

  async updateAdminMission(id, data) {
    return this.put(endpoints.admin.mission(id), data);
  }

  async deleteAdminMission(id) {
    return this.delete(endpoints.admin.mission(id));
  }

  // Content - Habits
  async getAdminHabits(params) {
    return this.get(endpoints.admin.habits, params);
  }

  async getAdminHabit(id) {
    return this.get(endpoints.admin.habit(id));
  }

  async createAdminHabit(data) {
    return this.post(endpoints.admin.habits, data);
  }

  async updateAdminHabit(id, data) {
    return this.put(endpoints.admin.habit(id), data);
  }

  async deleteAdminHabit(id) {
    return this.delete(endpoints.admin.habit(id));
  }

  // Content - Achievements
  async getAdminAchievements(params) {
    return this.get(endpoints.admin.achievements, params);
  }

  async getAdminAchievement(id) {
    return this.get(endpoints.admin.achievement(id));
  }

  async createAdminAchievement(data) {
    return this.post(endpoints.admin.achievements, data);
  }

  async updateAdminAchievement(id, data) {
    return this.put(endpoints.admin.achievement(id), data);
  }

  async deleteAdminAchievement(id) {
    return this.delete(endpoints.admin.achievement(id));
  }

  // Content - Challenges
  async getAdminChallenges(params) {
    return this.get(endpoints.admin.challenges, params);
  }

  async getAdminChallenge(id) {
    return this.get(endpoints.admin.challenge(id));
  }

  async createAdminChallenge(data) {
    return this.post(endpoints.admin.challenges, data);
  }

  async updateAdminChallenge(id, data) {
    return this.put(endpoints.admin.challenge(id), data);
  }

  async deleteAdminChallenge(id) {
    return this.delete(endpoints.admin.challenge(id));
  }

  // Small Data - Categories
  async getCategories(params) {
    return this.get(endpoints.admin.categories, params);
  }

  // Small Data - Difficulties
  async getDifficulties(params) {
    return this.get(endpoints.admin.difficulties, params);
  }

  // Small Data - Rarities
  async getRarities(params) {
    return this.get(endpoints.admin.rarities, params);
  }

  // Small Data - Statuses
  async getStatuses(params) {
    return this.get(endpoints.admin.statuses, params);
  }

  // Small Data - Ranks
  async getRanks(params) {
    return this.get(endpoints.admin.ranks, params);
  }

  // Small Data - Career Paths
  async getCareerPaths(params) {
    return this.get(endpoints.admin.careerPaths, params);
  }

  // Small Data - Badges
  async getBadges(params) {
    return this.get(endpoints.admin.badges, params);
  }

  // Small Data - Rewards
  async getRewards(params) {
    return this.get(endpoints.admin.rewards, params);
  }

  // Small Data - Notification Types
  async getNotificationTypes(params) {
    return this.get(endpoints.admin.notificationTypes, params);
  }

  // Small Data - Mission Types
  async getMissionTypes(params) {
    return this.get(endpoints.admin.missionTypes, params);
  }

  // Small Data - Challenge Types
  async getChallengeTypes(params) {
    return this.get(endpoints.admin.challengeTypes, params);
  }

  // Small Data - Countries
  async getCountries(params) {
    return this.get(endpoints.admin.countries, params);
  }

  // Small Data - Timezones
  async getTimezones(params) {
    return this.get(endpoints.admin.timezones, params);
  }

  // Small Data - Themes
  async getThemes(params) {
    return this.get(endpoints.admin.themes, params);
  }

  // Small Data - Languages
  async getLanguages(params) {
    return this.get(endpoints.admin.languages, params);
  }

  // Settings
  async getSettings() {
    return this.get(endpoints.admin.settings);
  }

  async updateSettings(data) {
    return this.put(endpoints.admin.settings, data);
  }
}

export const adminService = new AdminService();
export default adminService;