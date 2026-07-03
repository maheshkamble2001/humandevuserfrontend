// src/api/services/aiService.js
import BaseService from './baseService';
import { endpoints } from '../endpoints';

class AIService extends BaseService {
  constructor() {
    super(endpoints.ai.advice);
  }

  async getAdvice() {
    return this.get(endpoints.ai.advice);
  }

  async getMotivation() {
    return this.get(endpoints.ai.motivation);
  }

  async getTopicAdvice(params) {
    return this.get(endpoints.ai.topicAdvice, params);
  }

  async generateMissions(data) {
    return this.post(endpoints.ai.generateMissions, data);
  }

  async generateHabits(data) {
    return this.post(endpoints.ai.generateHabits, data);
  }

  async chat(data) {
    return this.post(endpoints.ai.chat, data);
  }

  async getRecommendations() {
    return this.get(endpoints.ai.recommendations);
  }
}

export const aiService = new AIService();
export default aiService;