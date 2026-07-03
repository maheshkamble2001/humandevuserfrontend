// src/api/endpoints.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const endpoints = {
  // Auth
  auth: {
    register: `${API_URL}/auth/register`,
    login: `${API_URL}/auth/login`,
    logout: `${API_URL}/auth/logout`,
    refresh: `${API_URL}/auth/refresh`,
    forgotPassword: `${API_URL}/auth/forgot-password`,
    resetPassword: `${API_URL}/auth/reset-password`,
  },
  
  // User
  user: {
    profile: `${API_URL}/user/profile`,
    update: `${API_URL}/user/profile`,
    password: `${API_URL}/user/password`,
    stats: `${API_URL}/user/profile/stats`,
    activity: `${API_URL}/user/profile/activity`,
    avatar: `${API_URL}/user/avatar`,
    byUsername: (username) => `${API_URL}/user/${username}`,
  },
  
  // Missions
  missions: {
    list: `${API_URL}/missions`,
    daily: `${API_URL}/missions/daily`,
    create: `${API_URL}/missions`,
    complete: (id) => `${API_URL}/missions/${id}/complete`,
    fail: (id) => `${API_URL}/missions/${id}/fail`,
    history: `${API_URL}/missions/history`,
    stats: `${API_URL}/missions/stats`,
  },
  
  // Habits
  habits: {
    list: `${API_URL}/habits`,
    create: `${API_URL}/habits`,
    update: (id) => `${API_URL}/habits/${id}`,
    delete: (id) => `${API_URL}/habits/${id}`,
    complete: (id) => `${API_URL}/habits/${id}/complete`,
    fail: (id) => `${API_URL}/habits/${id}/fail`,
    stats: (id) => `${API_URL}/habits/${id}/stats`,
  },
  
  // Achievements
  achievements: {
    list: `${API_URL}/achievements`,
    unlocked: `${API_URL}/achievements/unlocked`,
    unlock: (id) => `${API_URL}/achievements/${id}/unlock`,
    stats: `${API_URL}/achievements/stats`,
  },
  
  // Challenges
  challenges: {
    list: `${API_URL}/challenges`,
    active: `${API_URL}/challenges/active`,
    daily: `${API_URL}/challenges/daily`,
    create: `${API_URL}/challenges`,
    start: (id) => `${API_URL}/challenges/${id}/start`,
    complete: (id) => `${API_URL}/challenges/${id}/complete`,
    progress: (id) => `${API_URL}/challenges/${id}/progress`,
    fail: (id) => `${API_URL}/challenges/${id}/fail`,
    delete: (id) => `${API_URL}/challenges/${id}`,
    stats: `${API_URL}/challenges/stats`,
    leaderboard: `${API_URL}/challenges/leaderboard`,
    types: `${API_URL}/challenges/types`,
  },
  
  // Community
  community: {
    posts: `${API_URL}/community/posts`,
    create: `${API_URL}/community/posts`,
    post: (id) => `${API_URL}/community/posts/${id}`,
    update: (id) => `${API_URL}/community/posts/${id}`,
    delete: (id) => `${API_URL}/community/posts/${id}`,
    like: (id) => `${API_URL}/community/posts/${id}/like`,
    share: (id) => `${API_URL}/community/posts/${id}/share`,
    bookmark: (id) => `${API_URL}/community/posts/${id}/bookmark`,
    report: (id) => `${API_URL}/community/posts/${id}/report`,
    comments: (id) => `${API_URL}/community/posts/${id}/comments`,
    comment: (id) => `${API_URL}/community/comments/${id}`,
    likeComment: (id) => `${API_URL}/community/comments/${id}/like`,
    friends: `${API_URL}/community/friends`,
    friendRequests: `${API_URL}/community/friend-requests`,
    sendRequest: `${API_URL}/community/friend-requests`,
    acceptRequest: (id) => `${API_URL}/community/friend-requests/${id}/accept`,
    rejectRequest: (id) => `${API_URL}/community/friend-requests/${id}/reject`,
    removeFriend: (id) => `${API_URL}/community/friends/${id}`,
    suggestedFriends: `${API_URL}/community/suggested-friends`,
    notifications: `${API_URL}/community/notifications`,
    markNotificationsRead: `${API_URL}/community/notifications/mark-read`,
    deleteNotification: (id) => `${API_URL}/community/notifications/${id}`,
  },
  
  // Analytics
  analytics: {
    overview: `${API_URL}/analytics/overview`,
    trends: `${API_URL}/analytics/trends`,
    distribution: `${API_URL}/analytics/distribution`,
    insights: `${API_URL}/analytics/insights`,
    export: `${API_URL}/analytics/export`,
  },
  
  // AI
  ai: {
    advice: `${API_URL}/ai/advice`,
    motivation: `${API_URL}/ai/motivation`,
    topicAdvice: `${API_URL}/ai/advice/topic`,
    generateMissions: `${API_URL}/ai/missions/generate`,
    generateHabits: `${API_URL}/ai/habits/generate`,
    chat: `${API_URL}/ai/chat`,
    recommendations: `${API_URL}/ai/recommendations`,
  },
  
  // Admin
  admin: {
    // Dashboard
    stats: `${API_URL}/admin/stats`,
    
    // Users
    users: `${API_URL}/admin/users`,
    user: (id) => `${API_URL}/admin/users/${id}`,
    bulkUsers: `${API_URL}/admin/users/bulk`,
    activity: (id) => `${API_URL}/admin/users/${id}/activity`,
    
    // Roles
     roles: `${API_URL}/admin/roles`,
    role: (id) => `${API_URL}/admin/roles/${id}`,
    rolePermissions: (id) => `${API_URL}/admin/roles/${id}/permissions`,
    permissionsStructure: `${API_URL}/admin/roles/permissions/structure`,
    assignRole: `${API_URL}/admin/roles/assign`,
    
    // Additional role endpoints
    bulkAssign: `${API_URL}/admin/roles/bulk-assign`,
    bulkDelete: `${API_URL}/admin/roles/bulk-delete`,
    bulkUpdate: `${API_URL}/admin/roles/bulk-update`,
    templates: `${API_URL}/admin/roles/templates`,
    fromTemplate: `${API_URL}/admin/roles/from-template`,
    validate: `${API_URL}/admin/roles/validate`,
    checkSlug: `${API_URL}/admin/roles/check-slug`,
    stats: `${API_URL}/admin/roles/stats`,
    distribution: `${API_URL}/admin/roles/distribution`,
    permissionsAll: `${API_URL}/admin/roles/permissions/all`,
    permissionsGroups: `${API_URL}/admin/roles/permissions/groups`,
    myPermissions: `${API_URL}/admin/roles/my-permissions`,
    
    // Content - Missions
    missions: `${API_URL}/admin/missions`,
    mission: (id) => `${API_URL}/admin/missions/${id}`,
    
    // Content - Habits
    habits: `${API_URL}/admin/habits`,
    habit: (id) => `${API_URL}/admin/habits/${id}`,
    
    // Content - Achievements
    achievements: `${API_URL}/admin/achievements`,
    achievement: (id) => `${API_URL}/admin/achievements/${id}`,
    
    // Content - Challenges
    challenges: `${API_URL}/admin/challenges`,
    challenge: (id) => `${API_URL}/admin/challenges/${id}`,
    
    // Small Data - Categories
    categories: `${API_URL}/admin/categories`,
    
    // Small Data - Difficulties
    difficulties: `${API_URL}/admin/difficulties`,
    
    // Small Data - Rarities
    rarities: `${API_URL}/admin/rarities`,
    
    // Small Data - Statuses
    statuses: `${API_URL}/admin/statuses`,
    
    // Small Data - Ranks
    ranks: `${API_URL}/admin/ranks`,
    
    // Small Data - Career Paths
    careerPaths: `${API_URL}/admin/career-paths`,
    
    // Small Data - Badges
    badges: `${API_URL}/admin/badges`,
    
    // Small Data - Rewards
    rewards: `${API_URL}/admin/rewards`,
    
    // Small Data - Notification Types
    notificationTypes: `${API_URL}/admin/notification-types`,
    
    // Small Data - Mission Types
    missionTypes: `${API_URL}/admin/mission-types`,
    
    // Small Data - Challenge Types
    challengeTypes: `${API_URL}/admin/challenge-types`,
    
    // Small Data - Countries
    countries: `${API_URL}/admin/countries`,
    
    // Small Data - Timezones
    timezones: `${API_URL}/admin/timezones`,
    
    // Small Data - Themes
    themes: `${API_URL}/admin/themes`,
    
    // Small Data - Languages
    languages: `${API_URL}/admin/languages`,
    
    // Settings
    settings: `${API_URL}/admin/settings`,
  },
  
  // Health
  health: `${API_URL.replace('/api', '')}/health`,
};