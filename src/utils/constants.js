// src/utils/constants.js
export const RANKS = ['E', 'D', 'C', 'B', 'A', 'S', 'SS', 'Mythic'];

export const RANK_COLORS = {
  E: 'text-gray-400',
  D: 'text-blue-400',
  C: 'text-green-400',
  B: 'text-yellow-400',
  A: 'text-orange-400',
  S: 'text-red-400',
  SS: 'text-purple-400',
  Mythic: 'text-pink-400',
};

export const DIFFICULTIES = {
  easy: { label: 'Easy', color: 'text-green-400', xp: 25 },
  medium: { label: 'Medium', color: 'text-yellow-400', xp: 50 },
  hard: { label: 'Hard', color: 'text-orange-400', xp: 100 },
  legendary: { label: 'Legendary', color: 'text-red-400', xp: 200 },
};

export const MISSION_TYPES = {
  daily: 'Daily',
  weekly: 'Weekly',
  boss: 'Boss',
  special: 'Special',
};

export const HABIT_FREQUENCIES = {
  daily: 'Daily',
  weekly: 'Weekly',
  custom: 'Custom',
};

export const CAREER_PATHS = {
  developer: 'Developer',
  designer: 'Designer',
  business: 'Business',
  student: 'Student',
  fitness: 'Fitness',
  creator: 'Creator',
};