// src/api/services/missionService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class MissionService extends BaseService {
  constructor() {
    super(endpoints.missions.list);
  }

  async getDaily() {
    return this.get(endpoints.missions.daily);
  }

  async complete(id) {
    return this.post(endpoints.missions.complete(id));
  }

  async fail(id) {
    return this.post(endpoints.missions.fail(id));
  }

  async getHistory(params) {
    return this.get(endpoints.missions.history, params);
  }

  async getStats() {
    return this.get(endpoints.missions.stats);
  }
}

export const missionService = new MissionService();
export default missionService;