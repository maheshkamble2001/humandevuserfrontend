// src/api/endpoints.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
  auth: {
    login: `${API_URL}/auth/login`,
    register: `${API_URL}/auth/register`,
    logout: `${API_URL}/auth/logout`,
    refresh: `${API_URL}/auth/refresh`,
  },
  user: {
    profile: `${API_URL}/user/profile`,
    update: `${API_URL}/user/profile`,
    stats: `${API_URL}/user/stats`,
  },
  missions: {
    list: `${API_URL}/missions`,
    create: `${API_URL}/missions`,
    update: (id) => `${API_URL}/missions/${id}`,
    delete: (id) => `${API_URL}/missions/${id}`,
    complete: (id) => `${API_URL}/missions/${id}/complete`,
    daily: `${API_URL}/missions/daily`,
  },
  habits: {
    list: `${API_URL}/habits`,
    create: `${API_URL}/habits`,
    update: (id) => `${API_URL}/habits/${id}`,
    delete: (id) => `${API_URL}/habits/${id}`,
    complete: (id) => `${API_URL}/habits/${id}/complete`,
  },
  career: {
    paths: `${API_URL}/career/paths`,
    skills: `${API_URL}/career/skills`,
    progress: `${API_URL}/career/progress`,
    switch: `${API_URL}/career/switch`,
  },
  ai: {
    chat: `${API_URL}/ai/chat`,
    advice: `${API_URL}/ai/advice`,
    recommendations: `${API_URL}/ai/recommendations`,
  },
};

// src/api/endpoints.js
export const activityEndpoints = {
  getActivities: (params) => `/activities?${new URLSearchParams(params).toString()}`,
  getActivity: (id) => `/activities/${id}`,
  bookmark: (id) => `/activities/${id}/bookmark`,
  share: (id) => `/activities/${id}/share`,
  like: (id) => `/activities/${id}/like`,
  comment: (id) => `/activities/${id}/comment`,
  report: (id) => `/activities/${id}/report`,
};