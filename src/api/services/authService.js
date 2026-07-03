// src/api/services/authService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class AuthService extends BaseService {
  constructor() {
    super(endpoints.auth.login);
  }

  async register(userData) {
    return this.post(endpoints.auth.register, userData);
  }

  async login(credentials) {
    const data = await this.post(endpoints.auth.login, credentials);
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
    }
    return data;
  }

  async logout() {
    try {
      await this.post(endpoints.auth.logout);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }

  async refreshToken() {
    const data = await this.post(endpoints.auth.refresh);
    if (data.token) {
      localStorage.setItem('token', data.token);
    }
    return data;
  }

  async forgotPassword(email) {
    return this.post(endpoints.auth.forgotPassword, { email });
  }

  async resetPassword(token, newPassword) {
    return this.post(endpoints.auth.resetPassword, { token, newPassword });
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  getToken() {
    return localStorage.getItem('token');
  }

  isAuthenticated() {
    return !!this.getToken();
  }
}

export const authService = new AuthService();
export default authService;