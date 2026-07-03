// src/api/services/userService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class UserService extends BaseService {
  constructor() {
    super(endpoints.user.profile);
  }

  async getProfile() {
    return this.get(endpoints.user.profile);
  }

  async updateProfile(data) {
    return this.put(endpoints.user.update, data);
  }

  async changePassword(data) {
    return this.put(endpoints.user.password, data);
  }

  async getStats() {
    return this.get(endpoints.user.stats);
  }

  async getActivity() {
    return this.get(endpoints.user.activity);
  }

  async uploadAvatar(formData) {
    return this.post(endpoints.user.avatar, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  }

  async getUserByUsername(username) {
    return this.get(endpoints.user.byUsername(username));
  }
}

export const userService = new UserService();
export default userService;