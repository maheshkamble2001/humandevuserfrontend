// src/api/services/healthService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class HealthService extends BaseService {
  constructor() {
    super(endpoints.health);
  }

  async checkHealth() {
    return this.get(endpoints.health);
  }

  async getStatus() {
    try {
      const data = await this.get(endpoints.health);
      return { status: 'healthy', data };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  async ping() {
    try {
      const startTime = Date.now();
      const data = await this.get(endpoints.health);
      const responseTime = Date.now() - startTime;
      return { 
        status: 'online', 
        responseTime: `${responseTime}ms`,
        data 
      };
    } catch (error) {
      return { 
        status: 'offline', 
        error: error.message 
      };
    }
  }
}

export const healthService = new HealthService();
export default healthService;